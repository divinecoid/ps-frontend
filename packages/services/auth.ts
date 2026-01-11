import { POST } from "./api"
import { ENDPOINT } from "./endpoints"

export const login = async (username: string, password: string) => {
    const body = {
        username: username,
        password: password,
    }
    return await POST(ENDPOINT.LOGIN, body)
}

export const refresh = async () => {
    const refresh_token = await window.electronAPI.getRefreshToken();
    const body = {
        refresh_token: refresh_token,
    }
    return await POST(ENDPOINT.REFRESH, body)
}

export const logout = async () => {
    const refresh_token = await window.electronAPI.getRefreshToken();
    const body = {
        refresh_token: refresh_token,
    }
    const result = await POST(ENDPOINT.LOGOUT, body);
    if (result.ok) {
        await window.electronAPI.deleteRefreshToken();
        await window.electronAPI.deleteToken();
    }
    return result;
}