import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Size } from "@/interfaces/size";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.SIZE, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.SIZE}/master`, { page, per_page, search });
}

export const store = async (values: Size) => {
    return await POST(ENDPOINT.SIZE, values);
}

export const update = async (id: number, values: Size) => {
    return await PATCH(`${ENDPOINT.SIZE}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.SIZE}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.SIZE}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.SIZE}/${id}`);
}