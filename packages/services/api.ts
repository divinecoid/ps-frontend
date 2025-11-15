import { logout, refresh } from "./auth";

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
        if (result.status === 401 && token) {
            if (count <= 1) {
                const refreshResult = await refresh();
                if (refreshResult.ok) {
                    const json = await refreshResult.json();
                    const newToken = json["token"];
                    await window.electronAPI.saveToken(newToken);
                    onTokenRefreshed?.(newToken);
                    return await fetchWithTimeout(input, init, count + 1);
                } else {
                    await logout();
                    throw new Error("Unauthorized: Token refresh failed");
                }
            } else {
                await logout();
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

export const GET = async (path: string, params?: string) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path + "?" + params, {
        method: 'GET',
    })
}

export const POST = async (path: string, body: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export const PATCH = async (path: string, body: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}

export const PUT = async (path: string, body: {}) => {
    return await fetchWithTimeout(import.meta.env.VITE_APP_BASE_URL + path, {
        method: 'PUT',
        body: JSON.stringify(body),
    })
}

export const DELETE = async (path: string, body: {}) => {
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