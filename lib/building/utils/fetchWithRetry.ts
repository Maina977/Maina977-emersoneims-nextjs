export type FetchWithRetryOptions = {
	retries?: number;
	baseDelayMs?: number;
	timeoutMs?: number;
	method?: string;
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
	url: string,
	{ retries = 3, baseDelayMs = 200, timeoutMs = 5_000, method = 'HEAD' }: FetchWithRetryOptions = {}
): Promise<Response> {
	let lastError: unknown;

	for (let attempt = 0; attempt <= retries; attempt++) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);

		try {
			const res = await fetch(url, {
				method,
				signal: controller.signal,
				cache: 'no-store',
			});
			return res;
		} catch (err) {
			lastError = err;
		} finally {
			clearTimeout(timeout);
		}

		if (attempt < retries) {
			const delay = baseDelayMs * Math.pow(2, attempt);
			await sleep(delay);
		}
	}

	throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
