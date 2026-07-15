import {
  ApiEventType,
  Platform,
  RequestType,
  WordPressConnectionStatus,
} from "@prisma/client";
import { buildWordPressAuthHeader } from "@/src/lib/wordpress/auth";
import { canEncryptWordPressSecrets } from "@/src/lib/wordpress/encryption";
import {
  describeWordPressError,
  WordPressConfigError,
} from "@/src/lib/wordpress/errors";
import {
  mockConnection,
  mockCreatePost,
  mockTerms,
} from "@/src/lib/wordpress/mock";
import type {
  WordPressApiResult,
  WordPressClientSite,
  WordPressPostPayload,
  WordPressPostResponse,
  WordPressTermResponse,
} from "@/src/lib/wordpress/types";
import { prisma } from "@/lib/prisma";

type LogInput = {
  siteId: string;
  postId?: string | null;
  action: string;
  result: WordPressApiResult<unknown>;
  requestType: RequestType;
  requestSummary?: string;
  responseSummary?: string;
};

export class WordPressClient {
  constructor(private readonly site: WordPressClientSite) {}

  async testConnection() {
    if (this.site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false") {
      return mockConnection(this.site.siteUrl);
    }

    this.assertRealConnectionAllowed();
    return this.request("/users/me", "GET");
  }

  async findPostBySlug(slug: string) {
    if (this.site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false") {
      return {
        ok: true,
        statusCode: 200,
        endpoint: `/wp/v2/posts?slug=${slug}`,
        method: "GET",
        mockMode: true,
        data: [] as WordPressPostResponse[],
      };
    }

    this.assertRealConnectionAllowed();
    return this.request<WordPressPostResponse[]>(
      `/posts?slug=${encodeURIComponent(slug)}&status=draft,pending,private,publish&context=edit`,
      "GET",
    );
  }

  async createOrUpdatePost(
    payload: WordPressPostPayload,
    wordpressPostId?: string | null,
  ) {
    if (this.site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false") {
      return mockCreatePost(this.site.siteUrl, payload);
    }

    this.assertRealConnectionAllowed();
    const endpoint = wordpressPostId ? `/posts/${wordpressPostId}` : "/posts";
    return this.request<WordPressPostResponse>(endpoint, "POST", payload);
  }

  async syncTerms(kind: "categories" | "tags") {
    if (this.site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false") {
      return {
        ok: true,
        statusCode: 200,
        endpoint: `/wp/v2/${kind}`,
        method: "GET",
        mockMode: true,
        data: mockTerms(kind),
      };
    }

    this.assertRealConnectionAllowed();
    return this.request<WordPressTermResponse[]>(
      `/${kind}?per_page=100`,
      "GET",
    );
  }

  private assertRealConnectionAllowed() {
    if (!canEncryptWordPressSecrets()) {
      throw new WordPressConfigError(
        "WORDPRESS_ENCRYPTION_KEYが未設定のため、実WordPress接続は無効です。",
      );
    }
    if (!this.site.applicationPasswordEncrypted) {
      throw new WordPressConfigError("Application Passwordが未登録です。");
    }
  }

  private async request<T>(
    path: string,
    method: "GET" | "POST",
    body?: unknown,
  ): Promise<WordPressApiResult<T>> {
    const endpoint = `${this.site.apiBaseUrl.replace(/\/$/, "")}${path}`;
    let lastResult: WordPressApiResult<T> | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await this.requestOnce<T>(endpoint, method, body);
      lastResult = result;
      if (!shouldRetry(result, attempt)) return result;
    }

    return (
      lastResult ?? {
        ok: false,
        endpoint,
        method,
        mockMode: false,
        error: "WordPress API request failed",
      }
    );
  }

  private async requestOnce<T>(
    endpoint: string,
    method: "GET" | "POST",
    body?: unknown,
  ): Promise<WordPressApiResult<T>> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      Number(process.env.WORDPRESS_REQUEST_TIMEOUT_MS ?? 15000),
    );

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: buildWordPressAuthHeader(this.site),
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as T;
      return {
        ok: response.ok,
        statusCode: response.status,
        endpoint,
        method,
        mockMode: false,
        data: response.ok ? data : undefined,
        error: response.ok
          ? undefined
          : describeWordPressError(response.status),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "WordPress API request failed";
      return { ok: false, endpoint, method, mockMode: false, error: message };
    } finally {
      clearTimeout(timeout);
    }
  }
}

function shouldRetry<T>(result: WordPressApiResult<T>, attempt: number) {
  if (attempt >= 2) return false;
  if (
    result.statusCode === 401 ||
    result.statusCode === 403 ||
    result.statusCode === 429
  )
    return false;
  if (!result.statusCode) return true;
  return result.statusCode >= 500;
}

export async function logWordPressResult(input: LogInput) {
  const message = input.result.error;
  await prisma.$transaction([
    prisma.wordPressSyncLog.create({
      data: {
        wordpressSiteId: input.siteId,
        wordpressPostId: input.postId ?? null,
        action: input.action,
        endpoint: input.result.endpoint,
        method: input.result.method,
        statusCode: input.result.statusCode,
        success: input.result.ok,
        requestPayloadSummary: input.requestSummary,
        responsePayloadSummary: input.responseSummary,
        errorMessage: message,
        mockMode: input.result.mockMode,
      },
    }),
    prisma.apiUsageLog.create({
      data: {
        platform: Platform.WORDPRESS,
        eventType: input.result.ok ? ApiEventType.REQUEST : ApiEventType.ERROR,
        requestType: input.requestType,
        endpoint: input.result.endpoint,
        method: input.result.method,
        statusCode: input.result.statusCode,
        success: input.result.ok,
        mockMode: input.result.mockMode,
        message,
      },
    }),
  ]);
}

export function connectionStatusForResult(result: WordPressApiResult<unknown>) {
  if (!result.ok) return WordPressConnectionStatus.FAILED;
  return result.mockMode
    ? WordPressConnectionStatus.MOCK_CONNECTED
    : WordPressConnectionStatus.CONNECTED;
}
