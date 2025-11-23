import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { CMT } from "@/interfaces/cmt";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.CMT, { page, per_page, search });
}

export const store = async (values: CMT) => {
    return await POST(ENDPOINT.CMT, values);
}

export const update = async (id: number, values: CMT) => {
    return await PATCH(`${ENDPOINT.CMT}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.CMT}/${id}`);
}