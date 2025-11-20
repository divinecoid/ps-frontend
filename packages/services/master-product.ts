import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Product } from "@/interfaces/product";

const URL = {
    PRODUCT: "product"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.PRODUCT, { page, per_page, search });
}

export const store = async (values: Product) => {
    return await POST(URL.PRODUCT, values);
}

export const update = async (id: string, values: Product) => {
    return await PATCH(`${URL.PRODUCT}/${id}`, values);
}