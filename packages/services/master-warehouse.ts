import { GET } from "./api"

const URL = {
    WAREHOUSE: "warehouse"
}

export const index = async (page: number, per_page: number) => {
    return await GET(`${URL.WAREHOUSE}?page=${page}&per_page=${per_page}`);
}