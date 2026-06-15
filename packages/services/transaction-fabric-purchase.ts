import {
  BaseApiCallCreateProps,
  BaseApiCallDeleteProps,
  BaseApiCallIndexProps,
  BaseApiCallViewProps,
} from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api";
import { ENDPOINT } from "./endpoints";
import { FabricPurchaseCreate } from "@/interfaces/fabric-purchase";

export const index: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(ENDPOINT.FABRIC_PURCHASE, { page, per_page, search, sort });
};

export const master: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(`${ENDPOINT.FABRIC_PURCHASE}`, {
    page,
    per_page,
    search,
    sort,
  });
};

export const show: BaseApiCallViewProps = async (id) => {
  return await GET(`${ENDPOINT.FABRIC_PURCHASE}/${id}`);
};

export const store: BaseApiCallCreateProps<FabricPurchaseCreate> = async (
  values,
) => {
  const { details, ...header } = values;
  const payload = {
    ...header,
    details: details.map((detail) => ({
      color_id: detail.color_id,
      quantity: Number(detail.quantity),
    })),
  };

  return await POST(ENDPOINT.FABRIC_PURCHASE, payload);
};

export const destroy: BaseApiCallDeleteProps = async (id) => {
  return await DELETE(`${ENDPOINT.FABRIC_PURCHASE}/${id}`);
};

export const complete: BaseApiCallDeleteProps = async (id) => {
  return await PATCH(`${ENDPOINT.FABRIC_PURCHASE}/${id}/complete`);
};

export const series: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(`${ENDPOINT.FABRIC_PURCHASE}/series`, {
    page,
    per_page,
    search,
    sort,
  });
};
