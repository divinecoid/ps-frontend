import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { RollSize } from "@/interfaces/roll-size";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.ROLL_SIZE, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.ROLL_SIZE}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<RollSize> = async (values) => {
    return await POST(ENDPOINT.ROLL_SIZE, values);
}

export const update: BaseApiCallUpdateProps<RollSize> = async (id, values) => {
    return await PATCH(`${ENDPOINT.ROLL_SIZE}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.ROLL_SIZE}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.ROLL_SIZE}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.ROLL_SIZE}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.ROLL_SIZE}`, ids)
}

export const forceDestroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.ROLL_SIZE}/${id}/force`);
}

export const multiForceDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.ROLL_SIZE}/force`, ids)
}