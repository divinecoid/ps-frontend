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
    const result = await POST(URL.LOGIN, body)
    if (result.ok) {
        const json = await result.json();
        const token = json["token"];
        const refresh_token = json["refresh_token"];
        await window.electronAPI.saveToken(token);
        await window.electronAPI.saveRefreshToken(refresh_token);
    }
    return result;
}

export const refresh = async () => {
    const refresh_token = await window.electronAPI.getRefreshToken();
    const body = {
        refresh_token: refresh_token,
    }
    const result = await POST(URL.REFRESH, body)
    if (result.ok) {
        const json = await result.json();
        const token = json["token"];
        await window.electronAPI.saveToken(token);
    }
    return result;
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