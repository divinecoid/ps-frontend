import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { ProductModel } from "@/interfaces/product-model";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.PRODUCT_MODEL, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.PRODUCT_MODEL}/master`, { page, per_page, search });
}

export const store = async (values: ProductModel) => {
    return await POST(ENDPOINT.PRODUCT_MODEL, values);
}

export const update = async (id: number, values: ProductModel) => {
    return await PATCH(`${ENDPOINT.PRODUCT_MODEL}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.PRODUCT_MODEL}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.PRODUCT_MODEL}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.PRODUCT_MODEL}/${id}`);
}