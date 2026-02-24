export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const resolveUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  if (path.startsWith("/api/")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as
      | { detail?: unknown; message?: string }
      | string
      | null;
    if (typeof data === "string") {
      return data;
    }
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item) =>
          typeof item === "string" ? item : (item as { msg?: string }).msg,
        )
        .filter(Boolean)
        .join(", ");
    }
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    return data?.message || response.statusText;
  } catch {
    return response.statusText;
  }
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, token } = options;
  let response: Response;
  try {
    response = await fetch(resolveUrl(path), {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Check your connection.");
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
