import { BaseApiCallCreateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { GET, POST } from "./api"
import { ShopeeDocument, ShopeeShipOrder } from "@/interfaces/order";
import { ENDPOINT } from "./endpoints";

export const getShopeeShippingParameter: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.SHOPEE}/shipping-parameter?order_sn=${id}`);
}

export const shipOrderShopee: BaseApiCallCreateProps<ShopeeShipOrder> = async (data) => {
    return await POST(`${ENDPOINT.SHOPEE}/ship-order`, data);
}

export const downloadShippingDocument: BaseApiCallCreateProps<ShopeeDocument> = async (data) => {
    return await POST(`${ENDPOINT.SHOPEE}/download-shipping-document`, data);
}

export const fetchOrders = async () => {
    return await GET(`${ENDPOINT.SHOPEE}/fetch-orders`);
}