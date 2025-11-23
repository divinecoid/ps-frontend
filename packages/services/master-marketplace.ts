import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Marketplace } from "@/interfaces/marketplace";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.MARKETPLACE, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.MARKETPLACE}/master`, { page, per_page, search });
}

export const store = async (values: Marketplace) => {
    return await POST(ENDPOINT.MARKETPLACE, values);
}

export const update = async (id: number, values: Marketplace) => {
    return await PATCH(`${ENDPOINT.MARKETPLACE}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.MARKETPLACE}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.MARKETPLACE}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.MARKETPLACE}/${id}`);
}