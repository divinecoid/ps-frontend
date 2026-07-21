import {
  BaseApiCallCreateProps,
  BaseApiCallIndexProps,
  BaseApiCallViewProps,
} from "@/interfaces/base";
import { GET, POST } from "./api";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (
  page,
  per_page,
  search,
  sort,
) => {
  return await GET(ENDPOINT.RETURN_RECEIPT, { page, per_page, search, sort });
};

export const show: BaseApiCallViewProps = async (id) => {
  return await GET(`${ENDPOINT.RETURN_RECEIPT}/${id}`);
};

export const store: BaseApiCallCreateProps<{ awb_code: string }> = async (values) => {
  return await POST(ENDPOINT.RETURN_RECEIPT, values);
};

export const validateBarcode = async (values: { return_receipt_id: string; barcode: string }) => {
  return await POST(`${ENDPOINT.RETURN_RECEIPT}/validate-barcode`, values);
};

export const submit = async (values: {
  return_receipt_id: string;
  details: { id: string; barcode_scanned: string | null; is_received: boolean }[];
  notes?: string;
}) => {
  return await POST(`${ENDPOINT.RETURN_RECEIPT}/submit`, values);
};
