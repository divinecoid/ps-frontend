import { GET } from "./api"

const URL = {
    RACK: "rack"
}

export const index = async () => {
    return await GET(URL.RACK)
}