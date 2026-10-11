import { BaseApiCallIndexProps, BaseApiCallViewProps } from "@/interfaces/base";
import { GET } from "./api"
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.PRODUCT_GROUP, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.PRODUCT_GROUP}/master`, { page, per_page, search, sort });
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.PRODUCT_GROUP}/${id}`);
}

export const products = (id: string): BaseApiCallIndexProps => async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.PRODUCT_GROUP}/${id}/products`, { page, per_page, search, sort });
}
