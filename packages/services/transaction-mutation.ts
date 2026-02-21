import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, POST } from "./api"
import { Mutation, MutationValidate } from "@/interfaces/mutation";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.MUTATION, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.MUTATION, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Mutation> = async (values) => {
    return await POST(`${ENDPOINT.MUTATION}`, values);
}

export const validate: BaseApiCallCreateProps<MutationValidate> = async (values) => {
    return await POST(`${ENDPOINT.MUTATION}/validate`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.MUTATION}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.MUTATION}/${id}`);
}