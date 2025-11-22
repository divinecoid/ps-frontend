import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Color } from "@/interfaces/color";

const URL = {
    COLOR: "color"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.COLOR, { page, per_page, search });
}

export const store = async (values: Color) => {
    return await POST(URL.COLOR, values);
}

export const update = async (id: number, values: Color) => {
    return await PATCH(`${URL.COLOR}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${URL.COLOR}/${id}`);
}