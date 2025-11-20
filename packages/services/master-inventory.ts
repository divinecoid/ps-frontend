import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Inventory } from "@/interfaces/inventory";

const URL = {
    INVENTORY: "inventory"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.INVENTORY, { page, per_page, search });
}

export const store = async (values: Inventory) => {
    return await POST(URL.INVENTORY, values);
}

export const update = async (id: string, values: Inventory) => {
    return await PATCH(`${URL.INVENTORY}/${id}`, values);
}