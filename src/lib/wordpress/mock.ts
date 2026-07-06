import type {
  WordPressApiResult,
  WordPressConnectionResult,
  WordPressPostPayload,
  WordPressPostResponse,
  WordPressTermResponse
} from "@/src/lib/wordpress/types";

export function mockConnection(siteUrl: string): WordPressConnectionResult {
  return {
    ok: true,
    statusCode: 200,
    endpoint: "/wp/v2/users/me",
    method: "GET",
    mockMode: true,
    data: {
      id: "mock_wp_user",
      name: "Mock WordPress User",
      url: siteUrl
    }
  };
}

export function mockCreatePost(
  siteUrl: string,
  payload: WordPressPostPayload
): WordPressApiResult<WordPressPostResponse> {
  const id = `mock_wp_post_${Date.now()}`;
  const base = new URL(siteUrl).origin;
  return {
    ok: true,
    statusCode: 201,
    endpoint: "/wp/v2/posts",
    method: "POST",
    mockMode: true,
    data: {
      id,
      link: `${base}/mock-post/${payload.slug}`,
      slug: payload.slug,
      status: payload.status
    } satisfies WordPressPostResponse
  };
}

export function mockTerms(kind: "categories" | "tags"): WordPressTermResponse[] {
  const names =
    kind === "categories"
      ? ["AI副業", "比較", "初心者向け", "レビュー", "選び方"]
      : ["ChatGPT", "AIツール", "副業", "自動化", "効率化"];

  return names.map((name, index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: "",
    count: 0
  }));
}
