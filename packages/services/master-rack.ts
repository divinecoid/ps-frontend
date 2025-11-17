import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    RACK: "rack"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.RACK, { page, per_page, search });
}