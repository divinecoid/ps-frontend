import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Request } from "@/interfaces/request";
import { ENDPOINT } from "./endpoints";
import { toast } from "sonner";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.REQUEST, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.REQUEST}`, { page, per_page, search });
}

export const store = async (values: Request) => {
    return await POST(ENDPOINT.REQUEST, values);
}

export const update = async (id: number, values: Request) => {
    return await PATCH(`${ENDPOINT.REQUEST}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.REQUEST}/${id}`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.REQUEST}/${id}`);
}