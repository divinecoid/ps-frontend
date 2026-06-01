import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(ENDPOINT.CONFIGURATION, { page, per_page, search, sort });
};

export const master: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(`${ENDPOINT.CONFIGURATION}/master`, {
    page,
    per_page,
    search,
    sort,
  });
};

export const show: BaseApiCallViewProps = async (id) => {
  return await GET(`${ENDPOINT.CONFIGURATION}/${id}`);
};

export const store: BaseApiCallCreateProps<any> = async (values) => {
  return await POST(ENDPOINT.CONFIGURATION, values);
};

export const update: BaseApiCallUpdateProps<any> = async (id, values) => {
  return await PATCH(`${ENDPOINT.CONFIGURATION}/${id}`, values);
};

export const restore: BaseApiCallRestoreProps = async (id) => {
  return await POST(`${ENDPOINT.CONFIGURATION}/${id}/restore`);
};

export const destroy: BaseApiCallDeleteProps = async (id) => {
  return await DELETE(`${ENDPOINT.CONFIGURATION}/${id}`);
};

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
  return await DELETE(`${ENDPOINT.CONFIGURATION}`, ids);
};

export const forceDestroy: BaseApiCallDeleteProps = async (id) => {
  return await DELETE(`${ENDPOINT.CONFIGURATION}/${id}/force`);
};

export const multiForceDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
  return await DELETE(`${ENDPOINT.CONFIGURATION}/force`, ids);
};
