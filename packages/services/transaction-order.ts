import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Order } from "@/interfaces/order";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.ORDER, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.ORDER}`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Order> = async (values) => {
    return await POST(ENDPOINT.ORDER, values);
}

export const update: BaseApiCallUpdateProps<Order> = async (id, values) => {
    return await PATCH(`${ENDPOINT.ORDER}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.ORDER}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.ORDER}/${id}`);
}

export const barcode: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.ORDER}/barcode/${id}`);
}