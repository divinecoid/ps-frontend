import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Color } from "@/interfaces/color";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.COLOR, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.COLOR}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Color> = async (values) => {
    return await POST(ENDPOINT.COLOR, values);
}

export const update: BaseApiCallUpdateProps<Color> = async (id, values) => {
    return await PATCH(`${ENDPOINT.COLOR}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.COLOR}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.COLOR}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.COLOR}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.COLOR}`, ids)
}