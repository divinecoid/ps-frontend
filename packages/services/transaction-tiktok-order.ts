import { GET } from "./api";
import { ENDPOINT } from "./endpoints";

export const fetchOrders = async () => {
    return await GET(`${ENDPOINT.TIKTOK_SHOP}/get-order-list`);
}
