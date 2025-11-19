import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    INVENTORY: "inventory"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.INVENTORY, { page, per_page, search });
}