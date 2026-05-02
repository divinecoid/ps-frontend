import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { ProductModel } from "@/interfaces/product-model";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.PRODUCT_MODEL, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.PRODUCT_MODEL}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<ProductModel> = async (values) => {
    return await POST(ENDPOINT.PRODUCT_MODEL, values);
}

export const update: BaseApiCallUpdateProps<ProductModel> = async (id, values) => {
    return await PATCH(`${ENDPOINT.PRODUCT_MODEL}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.PRODUCT_MODEL}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.PRODUCT_MODEL}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.PRODUCT_MODEL}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.PRODUCT_MODEL}`, ids)
}

export const model_color = async (id: string, page?: number, per_page?: number, search?: string) => {
    return await GET(`${ENDPOINT.MODEL_COLOR}/${id}`, {page, per_page, search});
}

export const model_size = async (id: string) => {
    return await GET(`${ENDPOINT.MODEL_SIZE}/${id}`);
}