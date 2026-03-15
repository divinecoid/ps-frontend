import { BaseApiCallCreateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { ShopeeShipOrder } from "@/interfaces/order";
import { ENDPOINT } from "./endpoints";

export const getShopeeShippingParameter: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.SHOPEE}/shipping-parameter?order_sn=${id}`);
}

export const shipOrderShopee: BaseApiCallCreateProps<ShopeeShipOrder> = async (data) => {
    return await POST(`${ENDPOINT.SHOPEE}/ship-order`, data);
}