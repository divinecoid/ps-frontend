import { POST } from "./api"

const URL = {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh"
}

export const login = async (username: string, password: string) => {
    const body = {
        username: username,
        password: password,
    }
    return await POST(URL.LOGIN, body)
}