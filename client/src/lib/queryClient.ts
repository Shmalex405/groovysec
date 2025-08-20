import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Avoid accidental /api/api when caller passes "/api/..."
function normalizePath(path: string) {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE_URL.endsWith("/api") && p.startsWith("/api/")) {
    p = p.replace(/^\/api/, "");
  }
  return p;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const path = normalizePath(url);
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${path}`;

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    // no credentials to keep CORS simple
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Generic query function factory.
 * Returns null on 401 if on401 === "returnNull", otherwise throws.
 */
export function getQueryFn<T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T | null> {
  return async ({ queryKey }) => {
    const joined = `/${queryKey.join("/")}`;
    const path = normalizePath(joined);
    const fullUrl = `${API_BASE_URL}${path}`;

    const res = await fetch(fullUrl, {
      // no credentials to keep CORS simple
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});