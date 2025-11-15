import { POST } from "./api"

const URL = {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    REFRESH: "auth/refresh"
}

export const login = async (username: string, password: string) => {
    const body = {
        username: username,
        password: password,
    }
    return await POST(URL.LOGIN, body)
}

export const refresh = async () => {
    const refresh_token = await window.electronAPI.getRefreshToken();
    const body = {
        refresh_token: refresh_token,
    }
    return await POST(URL.REFRESH, body)
}

export const logout = async () => {
    const refresh_token = await window.electronAPI.getRefreshToken();
    const body = {
        refresh_token: refresh_token,
    }
    const result = await POST(URL.LOGOUT, body);
    if (result.ok) {
        await window.electronAPI.deleteRefreshToken();
        await window.electronAPI.deleteToken();
    }
    return result;
}