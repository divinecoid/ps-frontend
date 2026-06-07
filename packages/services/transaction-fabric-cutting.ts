import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { FabricCutting } from "@/interfaces/fabric-cutting";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.FABRIC_CUTTING, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.FABRIC_CUTTING}`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<FabricCutting> = async (values) => {
    const data: FabricCutting = {
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
    return await POST(ENDPOINT.FABRIC_CUTTING, data);
}

export const update: BaseApiCallUpdateProps<FabricCutting> = async (id, values) => {
    return await PATCH(`${ENDPOINT.FABRIC_CUTTING}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.FABRIC_CUTTING}/${id}`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.FABRIC_CUTTING}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.FABRIC_CUTTING}`, ids)
}

export const setReceived: BaseApiCallViewProps = async (id) => {
    return await PATCH(`${ENDPOINT.FABRIC_CUTTING}/${id}`);
}