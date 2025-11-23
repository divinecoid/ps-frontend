import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Color } from "@/interfaces/color";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.COLOR, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.COLOR}/master`, { page, per_page, search });
}

export const store = async (values: Color) => {
    return await POST(ENDPOINT.COLOR, values);
}

export const update = async (id: number, values: Color) => {
    return await PATCH(`${ENDPOINT.COLOR}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.COLOR}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.COLOR}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.COLOR}/${id}`);
}