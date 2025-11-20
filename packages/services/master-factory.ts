import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Factory } from "@/interfaces/factory";

const URL = {
    FACTORY: "factory"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.FACTORY, { page, per_page, search });
}

export const store = async (values: Factory) => {
    return await POST(URL.FACTORY, values);
}

export const update = async (id: string, values: Factory) => {
    return await PATCH(`${URL.FACTORY}/${id}`, values);
}