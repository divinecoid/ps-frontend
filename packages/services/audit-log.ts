import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET } from "./api";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.AUDIT_LOG, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.AUDIT_LOG, { page, per_page, search, sort });
}
