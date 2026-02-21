import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { OnlineStore } from "@/interfaces/online-store";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.ONLINE_STORE, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.ONLINE_STORE}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<OnlineStore> = async (values) => {
    return await POST(ENDPOINT.ONLINE_STORE, values);
}

export const update: BaseApiCallUpdateProps<OnlineStore> = async (id, values) => {
    return await PATCH(`${ENDPOINT.ONLINE_STORE}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.ONLINE_STORE}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.ONLINE_STORE}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.ONLINE_STORE}/${id}`);
}