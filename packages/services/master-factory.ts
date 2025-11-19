import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    FACTORY: "factory"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.FACTORY, { page, per_page, search });
}