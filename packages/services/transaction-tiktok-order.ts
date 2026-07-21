import { GET, POST } from "./api";
import { ENDPOINT } from "./endpoints";
import { TiktokShipPackage } from "@/interfaces/order";

export const fetchOrders = async (pageSize?: number) => {
  return await GET(`${ENDPOINT.TIKTOK_SHOP}/get-order-list`, {
    page_size: pageSize,
  });
};

export const getOrderDetail = async (id: string) => {
  return await GET(`${ENDPOINT.TIKTOK_SHOP}/get-order/${id}`);
};

export const getPackageDetail = async (packageId: string) => {
  return await GET(`${ENDPOINT.TIKTOK_SHOP}/package/${packageId}`);
};

export const getPackageHandoverTimeSlots = async (packageId: string) => {
  return await GET(
    `${ENDPOINT.TIKTOK_SHOP}/package/${packageId}/handover-time-slots`,
  );
};

export const downloadShippingDocument = async (data: { order_sn: string }) => {
  const orderDetailResponse = await GET(
    `${ENDPOINT.TIKTOK_SHOP}/get-order/${data.order_sn}`,
  );
  const orderDetailJson = await orderDetailResponse.json();

  if (!orderDetailResponse.ok || !orderDetailJson?.data) {
    throw new Error(
      orderDetailJson?.message || "Gagal mengambil detail order TikTok",
    );
  }

  // Robust packageId lookup: packages[0].id → line_items[0].package_id → line_items[0].id
  const order = orderDetailJson.data.orders?.[0];
  const packageId =
    order?.packages?.[0]?.id ??
    order?.line_items?.find((li: any) => li?.package_id)?.package_id ??
    null;

  if (!packageId) {
    throw new Error("Tidak dapat menemukan TikTok package ID untuk order ini");
  }

  return await GET(
    `${ENDPOINT.TIKTOK_SHOP}/package/${packageId}/shipping-documents`,
  );
};

export const shipPackage = async (packageId: string, body: object) => {
  return await POST(`${ENDPOINT.TIKTOK_SHOP}/package/${packageId}/ship`, body);
};
