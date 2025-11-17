import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    WAREHOUSE: "warehouse"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.WAREHOUSE, {page, per_page, search});
}