import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Factory } from "@/interfaces/factory";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.FACTORY, { page, per_page, search });
}

export const store = async (values: Factory) => {
    return await POST(ENDPOINT.FACTORY, values);
}

export const update = async (id: number, values: Factory) => {
    return await PATCH(`${ENDPOINT.FACTORY}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.FACTORY}/${id}`);
}