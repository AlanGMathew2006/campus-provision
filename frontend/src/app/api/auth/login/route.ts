import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const getErrorMessage = async (response: Response) => {
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

export async function POST(request: Request) {
  const payload = await request.json();
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    return NextResponse.json({ message }, { status: response.status });
  }

  const data = (await response.json()) as { token?: string; user?: unknown };
  if (!data?.token || !data?.user) {
    return NextResponse.json(
      { message: "Login failed. Please try again." },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ user: data.user });
  res.cookies.set({
    name: "cp_auth",
    value: data.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
