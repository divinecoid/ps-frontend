import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { CMT } from "@/interfaces/cmt";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.CMT, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.CMT}/master`, { page, per_page, search });
}

export const store: BaseApiCallCreateProps<CMT> = async (values) => {
    return await POST(ENDPOINT.CMT, values);
}

export const update: BaseApiCallUpdateProps<CMT> = async (id, values) => {
    return await PATCH(`${ENDPOINT.CMT}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.CMT}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.CMT}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.CMT}/${id}`);
}