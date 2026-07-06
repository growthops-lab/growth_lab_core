import type { WordPressSite } from "@prisma/client";

export type WordPressStatus = "draft" | "pending" | "private" | "publish";

export type WordPressApiResult<T> = {
  ok: boolean;
  statusCode?: number;
  data?: T;
  error?: string;
  endpoint: string;
  method: string;
  mockMode: boolean;
};

export type WordPressConnectionResult = WordPressApiResult<{
  id: number | string;
  name: string;
  url?: string;
}>;

export type WordPressPostPayload = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status: WordPressStatus;
  categories?: number[];
  tags?: number[];
};

export type WordPressPostResponse = {
  id: number | string;
  link: string;
  slug: string;
  status: string;
};

export type WordPressTermResponse = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
};

export type WordPressClientSite = Pick<
  WordPressSite,
  | "id"
  | "siteUrl"
  | "apiBaseUrl"
  | "username"
  | "applicationPasswordEncrypted"
  | "mockMode"
  | "defaultStatus"
  | "allowPublish"
>;
