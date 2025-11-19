import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    CMT: "cmt"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.CMT, { page, per_page, search });
}