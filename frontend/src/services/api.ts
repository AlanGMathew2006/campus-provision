export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const resolveUrl = (path: string) =>
  path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

const parseErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as
      | { detail?: string; message?: string }
      | string
      | null;
    if (typeof data === "string") {
      return data;
    }
    return data?.detail || data?.message || response.statusText;
  } catch {
    return response.statusText;
  }
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, token } = options;

  const response = await fetch(resolveUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
