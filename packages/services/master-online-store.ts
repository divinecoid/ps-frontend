import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { OnlineStore } from "@/interfaces/online-store";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.ONLINE_STORE, { page, per_page, search });
}

export const store = async (values: OnlineStore) => {
    return await POST(ENDPOINT.ONLINE_STORE, values);
}

export const update = async (id: number, values: OnlineStore) => {
    return await PATCH(`${ENDPOINT.ONLINE_STORE}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.ONLINE_STORE}/${id}`);
}