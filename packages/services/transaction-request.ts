import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Request } from "@/interfaces/request";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.REQUEST, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.REQUEST}`, { page, per_page, search });
}

export const store: BaseApiCallCreateProps<Request> = async (values) => {
    return await POST(ENDPOINT.REQUEST, values);
}

export const update: BaseApiCallUpdateProps<Request> = async (id, values) => {
    return await PATCH(`${ENDPOINT.REQUEST}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.REQUEST}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.REQUEST}/${id}`);
}

export const barcode: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.REQUEST}/barcode/${id}`);
}