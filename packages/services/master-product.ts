import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    PRODUCT: "product"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.PRODUCT, { page, per_page, search });
}