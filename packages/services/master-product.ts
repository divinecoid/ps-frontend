import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Product } from "@/interfaces/product";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.PRODUCT, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.PRODUCT}/master`, { page, per_page, search });
}

export const store = async (values: Product) => {
    return await POST(ENDPOINT.PRODUCT, values);
}

export const update = async (id: number, values: Product) => {
    return await PATCH(`${ENDPOINT.PRODUCT}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.PRODUCT}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.PRODUCT}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.PRODUCT}/${id}`);
}