import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { CMT } from "@/interfaces/cmt";

const URL = {
    CMT: "cmt"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.CMT, { page, per_page, search });
}

export const store = async (values: CMT) => {
    return await POST(URL.CMT, values);
}

export const update = async (id: string, values: CMT) => {
    return await PATCH(`${URL.CMT}/${id}`, values);
}