export async function withRetry<T>(
  operation: () => Promise<T>,
  retryable: (error: unknown) => boolean,
) {
  const enabled = process.env.GOOGLE_API_RETRY_ENABLED !== "false";
  const maxRetries = enabled
    ? Number(process.env.GOOGLE_API_MAX_RETRIES ?? 2)
    : 0;
  const baseDelay = Number(process.env.GOOGLE_API_RETRY_BASE_DELAY_MS ?? 2000);
  let attempt = 0;
  for (;;) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxRetries || !retryable(error)) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, baseDelay * 2 ** attempt),
      );
      attempt += 1;
    }
  }
}
