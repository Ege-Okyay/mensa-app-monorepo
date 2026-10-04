import type { ApiResponse } from "./types";

export interface ApiErrorInfo {
  message: string;
  code: string;
  status: number;
}

const BASE_URL = import.meta.env.VITE_API_URL;
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 5000;

export const isApiError = (error: any): error is ApiErrorInfo => {
  return error && typeof error === "object" && "code" in error && "status" in error;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      }
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw {
        message: "Server is temporarily unavailable",
        code: "SERVER_OFFLINE",
        status: response.status
      };
    }

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      const apiError = (result as any).error;

      throw {
        message: apiError?.message || result.message || "An unknown error occured",
        code: apiError?.code || "UNKNOWN_ERROR",
        status: response.status
      };
    }

    return result.data;
  } catch (error: any) {
    if (isApiError(error)) throw error;

    if (error.name === "AbortError") {
      throw {
        message: "Request timed out. Please check your connection",
        code: "TIMEOUT",
        status: 400
      };
    }

    if (typeof window !== "undefined" && !window.navigator.onLine) {
      throw {
        message: "No internet connection",
        code: "NETWORK_ERROR",
        status: 0
      };
    }

    throw {
      message: "Server is unreachable",
      code: "SERVER_OFFLINE",
      status: 503
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: any, options?: RequestInit) => request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) })
};
