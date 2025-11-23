import { refresh } from "./auth";
import { ENDPOINT } from "./endpoints";

const timeout = 5000;

let onTokenRefreshed: ((token: string) => void) | null = null;

export const setTokenRefreshListener = (callback: (token: string) => void) => {
    onTokenRefreshed = callback;
};

const fetchWithTimeout = async (input: string | URL | globalThis.Request, init?: RequestInit, count = 0): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const token = await window.electronAPI.getToken();
    try {
        const result = await fetch(input, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (result.status === 401 && token && !String(input).includes(ENDPOINT.REFRESH)) {
            if (count <= 1) {
                const refreshResult = await refresh();
                if (refreshResult.ok) {
                    const json = await refreshResult.json();
                    const newToken = json["token"];
                    await window.electronAPI.saveToken(newToken);
                    onTokenRefreshed?.(newToken);
                    return await fetchWithTimeout(input, init, count + 1);
                } else {
                    await window.electronAPI.deleteRefreshToken();
                    await window.electronAPI.deleteToken();
                    window.location.reload();
                    throw new Error("Unauthorized: Token refresh failed");
                }
            } else {
                await window.electronAPI.deleteRefreshToken();
                await window.electronAPI.deleteToken();
                window.location.reload();
                throw new Error("Too many refresh attempts");
            }
        }
        return result;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error("Request timed out");
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    }
}

export const GET = async (path: string, params?: Record<string, any>) => {
    const url = new URL(import.meta.env.VITE_APP_BASE_URL + path);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return await fetchWithTimeout(url.toString(), {
        method: "GET",
    });
}

export const POST = async (path: string, body?: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export const PATCH = async (path: string, body?: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}

export const PUT = async (path: string, body?: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'PUT',
        body: JSON.stringify(body),
    })
}

export const DELETE = async (path: string, body?: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'DELETE',
        body: JSON.stringify(body),
    })
}

export const DELETE_ALL = async (path: string) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'DELETE',
    })
}