import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Marketplace } from "@/interfaces/marketplace";

const URL = {
    MARKETPLACE: "marketplace"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.MARKETPLACE, { page, per_page, search });
}

export const store = async (values: Marketplace) => {
    return await POST(URL.MARKETPLACE, values);
}

export const update = async (id: string, values: Marketplace) => {
    return await PATCH(`${URL.MARKETPLACE}/${id}`, values);
}

export const show = async (id: string) => {
    return await GET(`${URL.MARKETPLACE}/${id}`);
}