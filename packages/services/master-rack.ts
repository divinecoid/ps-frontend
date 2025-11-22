import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Rack } from "@/interfaces/rack";

const URL = {
    RACK: "rack"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.RACK, { page, per_page, search });
}

export const store = async (values: Rack) => {
    return await POST(URL.RACK, values);
}

export const update = async (id: number, values: Rack) => {
    return await PATCH(`${URL.RACK}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${URL.RACK}/${id}`);
}