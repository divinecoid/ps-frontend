import { GET } from "./api"

const URL = {
    RACK: "rack"
}

export const index = async (page: number, per_page: number) => {
    return await GET(`${URL.RACK}?page=${page}&per_page=${per_page}`);
}