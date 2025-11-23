import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Rack } from "@/interfaces/rack";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.RACK, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.RACK}/master`, { page, per_page, search });
}

export const store = async (values: Rack) => {
    return await POST(ENDPOINT.RACK, values);
}

export const update = async (id: number, values: Rack) => {
    return await PATCH(`${ENDPOINT.RACK}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.RACK}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.RACK}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.RACK}/${id}`);
}