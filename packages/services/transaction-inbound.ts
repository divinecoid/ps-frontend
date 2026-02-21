import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, POST } from "./api"
import { Inbound, InboundValidate } from "@/interfaces/inbound";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.INBOUND, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.INBOUND, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Inbound> = async (values) => {
    return await POST(`${ENDPOINT.INBOUND}`, values);
}

export const validate: BaseApiCallCreateProps<InboundValidate> = async (values) => {
    return await POST(`${ENDPOINT.INBOUND}/validate`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.INBOUND}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.INBOUND}/${id}`);
}