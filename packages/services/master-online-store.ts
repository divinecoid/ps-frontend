import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    ONLINE_STORE: "onlinestore"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.ONLINE_STORE, { page, per_page, search });
}