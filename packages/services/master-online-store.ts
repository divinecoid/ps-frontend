import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { OnlineStore } from "@/interfaces/online-store";

const URL = {
    ONLINE_STORE: "onlinestore"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.ONLINE_STORE, { page, per_page, search });
}

export const store = async (values: OnlineStore) => {
    return await POST(URL.ONLINE_STORE, values);
}

export const update = async (id: string, values: OnlineStore) => {
    return await PATCH(`${URL.ONLINE_STORE}/${id}`, values);
}