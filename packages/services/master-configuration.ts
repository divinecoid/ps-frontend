import { BaseApiCallIndexProps, BaseApiCallViewProps } from "@/interfaces/base";
import { GET } from "./api";
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
  return await GET(`${ENDPOINT.CONFIGURATION}`, {
    page,
    per_page,
    search,
    sort,
  });
};

export const show: BaseApiCallViewProps = async (id) => {
  return await GET(`${ENDPOINT.CONFIGURATION}/${id}`);
};
