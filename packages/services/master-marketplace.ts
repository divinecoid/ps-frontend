import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    MARKETPLACE: "marketplace"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.MARKETPLACE, { page, per_page, search });
}