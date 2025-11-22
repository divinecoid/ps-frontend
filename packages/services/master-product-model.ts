import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { ProductModel } from "@/interfaces/product-model";

const URL = {
    PRODUCT_MODEL: "model"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.PRODUCT_MODEL, { page, per_page, search });
}


export const store = async (values: ProductModel) => {
    return await POST(URL.PRODUCT_MODEL, values);
}

export const update = async (id: string, values: ProductModel) => {
    return await PATCH(`${URL.PRODUCT_MODEL}/${id}`, values);
}

export const show = async (id: string) => {
    return await GET(`${URL.PRODUCT_MODEL}/${id}`);
}