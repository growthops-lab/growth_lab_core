export class WordPressConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordPressConfigError";
  }
}

export function describeWordPressError(statusCode?: number, fallback = "WordPress API request failed") {
  if (!statusCode) return fallback;
  if (statusCode === 400) return "入力内容に問題があります。";
  if (statusCode === 401) return "WordPress認証に失敗しました。Application Passwordを確認してください。";
  if (statusCode === 403) return "WordPress APIを実行する権限がありません。";
  if (statusCode === 404) return "WordPress REST APIまたは対象リソースが見つかりません。";
  if (statusCode === 429) return "WordPress APIのレート制限に到達しました。";
  if (statusCode >= 500) return "WordPress側で一時的なエラーが発生しました。";
  return fallback;
}
