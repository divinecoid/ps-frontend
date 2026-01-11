import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Marketplace } from "@/interfaces/marketplace";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.MARKETPLACE, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.MARKETPLACE}/master`, { page, per_page, search });
}

export const store: BaseApiCallCreateProps<Marketplace> = async (values) => {
    return await POST(ENDPOINT.MARKETPLACE, values);
}

export const update: BaseApiCallUpdateProps<Marketplace> = async (id, values) => {
    return await PATCH(`${ENDPOINT.MARKETPLACE}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.MARKETPLACE}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.MARKETPLACE}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.MARKETPLACE}/${id}`);
}