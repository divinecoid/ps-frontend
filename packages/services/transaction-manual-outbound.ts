import { BaseApiCallCreateProps, BaseApiCallIndexProps, BaseApiCallViewProps } from "@/interfaces/base";
import { GET, POST } from "./api";
import { ManualOutboundSubmit, ManualOutboundValidateBarcode } from "@/interfaces/manual-outbound";

const ENDPOINT = "outbound-manual";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT, { page, per_page, search, sort });
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT}/${id}`);
}

export const validateBarcode: BaseApiCallCreateProps<ManualOutboundValidateBarcode> = async (values) => {
    return await POST(`${ENDPOINT}/validate-barcode`, values);
}

export const submit: BaseApiCallCreateProps<ManualOutboundSubmit> = async (values) => {
    return await POST(`${ENDPOINT}/submit`, values);
}
