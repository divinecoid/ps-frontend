import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Size } from "@/interfaces/size";

const URL = {
    SIZE: "size"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.SIZE, { page, per_page, search });
}

export const store = async (values: Size) => {
    return await POST(URL.SIZE, values);
}

export const update = async (id: string, values: Size) => {
    return await PATCH(`${URL.SIZE}/${id}`, values);
}