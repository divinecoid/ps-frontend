import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Request } from "@/interfaces/request";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.REQUEST, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.REQUEST}`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Request> = async (values) => {
    const data: Request = {
        ...values,
        request_detail: values.request_detail.map(detail => {
            const filteredVariant = detail.variant_detail?.filter(variant => {
                const total = (variant.dozen_qty * 12) + variant.piece_qty
                return total > 0
            })
            return {
                ...detail,
                variant_detail: filteredVariant
            }
        }).filter(detail => (detail.variant_detail?.length ?? 0) > 0)
    }
    return await POST(ENDPOINT.REQUEST, data);
}

export const update: BaseApiCallUpdateProps<Request> = async (id, values) => {
    return await PATCH(`${ENDPOINT.REQUEST}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.REQUEST}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.REQUEST}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.REQUEST}`, ids)
}

export const barcode: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.REQUEST}/barcode/${id}`);
}