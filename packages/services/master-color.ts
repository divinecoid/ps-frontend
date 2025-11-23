import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Color } from "@/interfaces/color";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.COLOR, { page, per_page, search });
}

export const store = async (values: Color) => {
    return await POST(ENDPOINT.COLOR, values);
}

export const update = async (id: number, values: Color) => {
    return await PATCH(`${ENDPOINT.COLOR}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.COLOR}/${id}`);
}