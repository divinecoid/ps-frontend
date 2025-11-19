import { BaseApiCallProps } from "@/interfaces/base";
import { GET } from "./api"

const URL = {
    COLOR: "color"
}

export const index: BaseApiCallProps = async (page, per_page, search) => {
    return await GET(URL.COLOR, { page, per_page, search });
}