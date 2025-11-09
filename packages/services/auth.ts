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
    console.log(body)
    return await POST(URL.LOGIN, body)
}