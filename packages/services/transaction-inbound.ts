import { BaseApiCallCreateProps } from "@/interfaces/base";
import { POST } from "./api"
import { Inbound, InboundValidate } from "@/interfaces/inbound";
import { ENDPOINT } from "./endpoints";

export const store: BaseApiCallCreateProps<Inbound> = async (values) => {
    return await POST(`${ENDPOINT.INBOUND}`, values);
}

export const validate: BaseApiCallCreateProps<InboundValidate> = async (values) => {
    return await POST(`${ENDPOINT.INBOUND}/validate`, values);
}