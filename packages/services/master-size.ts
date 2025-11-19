import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    SIZE: "size"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.SIZE, { page, per_page, search });
}