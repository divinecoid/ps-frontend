import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    PRODUCT_MODEL: "model"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.PRODUCT_MODEL, { page, per_page, search });
}