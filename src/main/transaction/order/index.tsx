import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clipboard, Download, Eye } from "lucide-react";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Order } from "@/interfaces/order";
import { toast } from "sonner";
import { downloadFile } from "@/lib/file";
import { useState } from "react";

export default function OrderPage() {
  const [fetchingShopee, setFetchingShopee] = useState(false);
  const [fetchingTiktok, setFetchingTiktok] = useState(false);

  const handleFetchShopee = async (onSubmit: () => void) => {
    try {
      setFetchingShopee(true);
      const res = await Services.TransactionShopeeOrder.fetchOrders();
      if (res?.ok) {
        toast.success("Berhasil fetch order Shopee", { richColors: true });
        onSubmit();
      } else {
        const json = await res?.json();
        toast.error(json?.message || "Gagal fetch order Shopee", {
          richColors: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setFetchingShopee(false);
    }
  };

  const handleFetchTiktok = async (onSubmit: () => void) => {
    try {
      setFetchingTiktok(true);
      const res = await Services.TransactionTiktokOrder.fetchOrders(100);
      if (res?.ok) {
        toast.success("Berhasil fetch order Tiktok", { richColors: true });
        onSubmit();
      } else {
        const json = await res?.json();
        toast.error(json?.message || "Gagal fetch order Tiktok", {
          richColors: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setFetchingTiktok(false);
    }
  };

  const checkMarketplace = (data: Order) => {
    switch (data.marketplace.code) {
      case "shopee":
        return Services.TransactionShopeeOrder.downloadShippingDocument;
      case "tiktok":
      case "tiktok_shop":
        return Services.TransactionTiktokOrder.downloadShippingDocument;
      case "lazada":
        return;
      default:
        return;
    }
  };
  const downloadDocument = async (data: Order) => {
    const values = {
      order_sn: data.order_sn,
      // shipping_document_type: 'NORMAL_AIR_WAYBILL'
    };
    try {
      const downloadFunc = checkMarketplace(data);
      if (!downloadFunc) {
        toast.error(`Marketplace ${data.marketplace.code} belum didukung untuk download dokumen`, { richColors: true });
        return;
      }
      
      const res = await downloadFunc(values);
      if (res?.ok) {
        const filePath = await downloadFile(res);
        if (filePath) {
          toast.info(`Download completed on ${filePath}`, {
            action: {
              label: "Open",
              onClick: () => {
                window.electronAPI.openFile(filePath);
              },
            },
            richColors: true,
          });
        } else {
          toast.error("File path not valid", { richColors: true });
        }
      } else {
        const json = await res?.json().catch(() => null);
        const text = await res?.text().catch(() => null);
        let message = "Gagal mengunduh dokumen";

        if (json?.error) {
          message = String(json.error);
          // If there's a TikTok code, append it for debugging
          if (json?.code) {
            message += ` (Code: ${json.code})`;
          }
        } else if (json?.message) {
          const rawMessage = String(json.message);
          const colonIndex = rawMessage.indexOf(": ");
          if (colonIndex !== -1) {
            const afterColon = rawMessage.substring(colonIndex + 2);
            try {
              const parsed = JSON.parse(afterColon);
              message = parsed?.message || rawMessage;
            } catch {
              message = rawMessage;
            }
          } else {
            message = rawMessage;
          }
        } else if (text) {
          const trimmed = String(text).trim();
          if (trimmed !== "") {
            message = trimmed;
          }
        } else if (res) {
          message = res.statusText || message;
        }

        toast.error(message, { richColors: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    }
  };
  return (
    <OverviewPage
      columns={columns}
      source={Services.TransactionOrder}
      actions={({ onSubmit }) => [
        <Button
          key="fetch-shopee"
          variant="outline"
          onClick={() => handleFetchShopee(onSubmit)}
          disabled={fetchingShopee}
        >
          {fetchingShopee ? "Fetching Shopee..." : "Fetch Shopee Manual"}
        </Button>,
        <Button
          key="fetch-tiktok"
          variant="outline"
          onClick={() => handleFetchTiktok(onSubmit)}
          disabled={fetchingTiktok}
        >
          {fetchingTiktok ? "Fetching Tiktok..." : "Fetch Tiktok Manual"}
        </Button>,
      ]}
      rowActions={({ row }) => (
        <div className="flex gap-2 justify-end">
          <TooltipHover tooltip="Lihat">
            <Button asChild variant="outline">
              <Link
                to={`./${row.id}`}
                state={{ total_amount: row.total_amount }}
              >
                <Eye />
              </Link>
            </Button>
          </TooltipHover>
          {(row.status.toLowerCase() === "ready_to_pickup" ||
            row.status.toLowerCase() === "ready_to_ship") && (
            <TooltipHover tooltip="Unduh">
              <Button variant="outline" onClick={() => downloadDocument(row)}>
                <Download />
              </Button>
            </TooltipHover>
          )}
          <TooltipHover tooltip="Salin Order SN">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={async () =>
                await navigator.clipboard.writeText(row.order_sn)
              }
            >
              <Clipboard />
            </Button>
          </TooltipHover>
        </div>
      )}
    />
  );
}
