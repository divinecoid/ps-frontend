import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z, { string } from "zod/v3";
import { formatDateTime } from "@/lib/format-date";
import { downloadFile } from "@/lib/file";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddressList,
  OrderViewResponse,
  ShopeeOrderShippingParameter,
  ShopeeShipOrder,
  TimeSlot,
  ViewOrderDetail,
  OrderItemsResponse,
  OrderItem,
} from "@/interfaces/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Hash,
  Truck,
  Store,
  Package,
  Wallet,
  User,
  Phone,
  MapPin,
  MapPinned,
  Clock,
  PackageX,
  Download,
} from "lucide-react";

// Gabungkan validasi skema: address_id dan pickup_time_id dibuat opsional agar fleksibel di kedua kondisi status
const schema = z.object({
  address_id: z.string().optional(),
  pickup_time_id: z.string().optional(),
});

// ─── SKU Parser ──────────────────────────────────────────────────────────────

interface ParsedSkuItem {
  /** SKU produk (e.g. PANJANGPOLOS, OBLONGHITAM) */
  sku: string;
  /** Logo jika ada (e.g. LOGO48) */
  logo: string | null;
  /** Warna produk */
  warna: string | null;
  /** Ukuran produk */
  ukuran: string | null;
  /** ID order item asal (untuk mapping ke payload API) */
  sourceOrderItemId: string;
  /** Indeks item dalam order (untuk unique key) */
  sourceItemIndex: number;
  /** Indeks urut dalam hasil parse satu order item (0-based) */
  parsedIndex: number;
}

/**
 * Mengurai SKU teks menjadi daftar item individual.
 *
 * Format: [PAKET{N}-][LOGO{n}*]<SKU>[+<SKU_extra>]
 *
 * Contoh:
 *   PAKET3-LOGO48*PANJANGPOLOS+OBLONGHITAM  → 3× PANJANGPOLOS (pakai logo) + 1× OBLONGHITAM
 *   LOGO48*PANJANGPOLOS                     → 1× PANJANGPOLOS (pakai logo)
 *   PAKET3-PANJANGPOLOS                     → 3× PANJANGPOLOS
 *
 * @param skuText     - Teks SKU dari order
 * @param warnaString - Warna dipisah "|" (e.g. "Merah|Biru|Hitam"), urut sesuai jumlah paket
 * @param ukuran      - Ukuran item (e.g. "M", "L", "XL")
 */
function parseSku(
  skuText: string,
  warnaString: string = "",
  ukuran: string | null = null,
): Omit<ParsedSkuItem, "sourceOrderItemId" | "sourceItemIndex" | "parsedIndex">[] {
  const regex = /^(?:(PAKET(\d+))-)?(?:(.+?)\*)?([^+]+)(?:\+(.+))?$/;
  const match = skuText.match(regex);

  if (!match) return [];

  const jumlah = Number(match[2] ?? 1);
  const logo = match[3] ?? null;
  const sku = match[4];
  const extra = match[5] ?? null;

  const warna = warnaString ? warnaString.split(/[|=]/) : [];
  const result: Omit<ParsedSkuItem, "sourceOrderItemId" | "sourceItemIndex" | "parsedIndex">[] = [];

  for (let i = 0; i < jumlah; i++) {
    result.push({
      sku,
      logo,
      warna: warna[i] ?? "Hitam",
      ukuran,
    });
  }

  if (extra) {
    result.push({
      sku: extra,
      logo: null,
      warna: null,
      ukuran,
    });
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status?: string }) => {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "ready_to_pickup":
      return (
        <Badge variant="success" className="capitalize">
          {status?.replaceAll("_", " ")}
        </Badge>
      );
    case "pending":
    case "prepared":
    case "read":
    case "shipped":
    case "ready_to_ship":
    case "retry_ship":
      return (
        <Badge variant="secondary" className="capitalize">
          {status?.replaceAll("_", " ")}
        </Badge>
      );
    case "cancelled":
    case "returned":
      return (
        <Badge variant="destructive" className="capitalize">
          {status?.replaceAll("_", " ")}
        </Badge>
      );
    default:
      return (
        <Badge variant="default" className="capitalize">
          {status?.replaceAll("_", " ")}
        </Badge>
      );
  }
};

const formatCurrency = (value?: number) => {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

const copyText = async (value: string, label: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`Berhasil menyalin ${label}`, { richColors: true });
  } catch (error) {
    toast.error(`Gagal menyalin ${label}`, { richColors: true });
  }
};

const InfoField = ({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-start gap-2.5 ${className ?? ""}`}>
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-semibold wrap-break-word">{children}</div>
    </div>
  </div>
);

export default function FormOrder(_props: BaseForm) {
  const { id } = useParams();
  const [loading, setLoading] = React.useState<boolean>(id ? true : false);
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<ViewOrderDetail>();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingParameter, setShippingParameter] = useState<AddressList[]>();
  const [pickupTime, setPickupTime] = useState<TimeSlot[]>();
  const [tiktokPackageId, setTiktokPackageId] = useState<string>();
  const [tiktokShipError, setTiktokShipError] = useState<string>();
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number | undefined>(
    location.state?.total_amount,
  );
  const [totalShipping, setTotalShipping] = useState<number | undefined>();

  const [disabled, setDisabled] = useState<boolean>(true);

  // States untuk barcode pickup (Fitur Kode Kedua)
  const [barcodeRecommendations, setBarcodeRecommendations] = useState<Record<string, string[]>>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Record<string, string>>({});

  /**
   * expandedItems: hasil parse SKU dari setiap OrderItem.
   * Setiap OrderItem bisa menghasilkan beberapa ParsedSkuItem (paket / extra).
   * Backend getOrderItems sudah mengembalikan data yang diekspansi berdasarkan kuantitas,
   * sehingga kita tidak perlu mengalikannya lagi dengan qty di sini.
   */
  const expandedItems = React.useMemo<ParsedSkuItem[]>(() => {
    const result: ParsedSkuItem[] = [];
    items.forEach((item) => {
      const parsed = parseSku(
        item.sku,
        item.color ?? "",
        item.size ?? null,
      );
      parsed.forEach((p) => {
        result.push({
          ...p,
          sourceOrderItemId: String(item.id),
          sourceItemIndex: item.item_index,
          parsedIndex: result.length,
        });
      });
    });
    return result;
  }, [items]);

  const uniqueOrderItems = React.useMemo<OrderItem[]>(() => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }, [items]);

  const form = useForm({

    resolver: zodResolver(schema),
  });

  const addressId = useWatch({
    control: form.control,
    name: "address_id",
  });

  // Fungsi Fetch Produk & Barcode untuk Fitur Pickup
  const fetchProductsForSkus = async (skus: string[]) => {
    setLoadingRecommendations(true);
    try {
      const recommendations: Record<string, string[]> = {};
      for (const sku of skus) {
        const res = await Services.MasterProduct?.index?.(1, 100, sku);
        const json = await res?.json();
        if (res?.ok && json?.success && json?.data) {
          json.data.forEach((product: any) => {
            const parts = product.barcode.split('|');
            // Format barcode: ID|KodeUnik|SKU|Warna|Ukuran|NoGudang
            if (parts[2] === sku) {
              const warnaKey = (parts[3] || "").toLowerCase();
              const ukuranKey = (parts[4] || "").toLowerCase();
              const key = `${sku.toLowerCase()}-${warnaKey}-${ukuranKey}`;
              
              if (!recommendations[key]) {
                recommendations[key] = [];
              }
              recommendations[key].push(product.barcode);
            }
          });
        }
      }
      setBarcodeRecommendations(recommendations);
    } catch (error) {
      console.error("Failed to fetch barcode recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleUseRecommendation = (key: string, barcode: string) => {
    setScannedBarcodes((prev) => ({
      ...prev,
      [key]: barcode,
    }));
  };

  const handleUseAllRecommendations = () => {
    const newBarcodes: Record<string, string> = {};
    expandedItems.forEach((item, index) => {
      const itemSku = (item.sku || "").toLowerCase();
      const itemWarna = (item.warna || "").toLowerCase();
      const itemUkuran = (item.ukuran || "").toLowerCase();
      const recKey = `${itemSku}-${itemWarna}-${itemUkuran}`;

      const indexInGroup = expandedItems
        .slice(0, index)
        .filter(
          (i) =>
            (i.sku || "").toLowerCase() === itemSku &&
            (i.warna || "").toLowerCase() === itemWarna &&
            (i.ukuran || "").toLowerCase() === itemUkuran
        ).length;

      const recs = barcodeRecommendations[recKey] || [];
      const recommended = recs[indexInGroup] || "";
      const key = `${item.sourceOrderItemId}-${item.sourceItemIndex}-${item.parsedIndex}`;
      if (recommended) {
        newBarcodes[key] = recommended;
      }
    });
    setScannedBarcodes((prev) => ({
      ...prev,
      ...newBarcodes,
    }));
  };

  const getSkuSummary = () => {
    const summary: Record<string, number> = {};
    expandedItems.forEach((item) => {
      summary[item.sku] = (summary[item.sku] || 0) + 1;
    });
    return Object.entries(summary).map(([sku, quantity]) => ({ sku, quantity }));
  };

  // Pemicu Fetch Barcode jika status ready_to_pickup
  React.useEffect(() => {
    if (expandedItems.length > 0 && data?.status === "ready_to_pickup") {
      const uniqueSkus = Array.from(new Set(expandedItems.map((item) => item.sku)));
      fetchProductsForSkus(uniqueSkus);
    }
  }, [expandedItems, data?.status]);

  // Main Effect: Fetch Data Order & Parameter Pengiriman Marketplace
  React.useEffect(() => {
    const getShopeeShippingParameter = async (orderSn: string) => {
      const res =
        await Services.TransactionShopeeOrder?.getShopeeShippingParameter?.(
          orderSn,
        );
      const json: ShopeeOrderShippingParameter = await res.json();
      if (
        res?.ok &&
        json.success == true &&
        json.data.error == "" &&
        json.data.warning == ""
      ) {
        setDisabled(false);
        if (json.data.response.info_needed.dropoff != undefined) {
          submitShipping({ order_sn: orderSn, dropoff: json.data.response.dropoff, marketplace_code: "shopee" })
        } else {
          setShippingParameter(json.data.response.pickup.address_list);
        }
      } else {
        if (json.data.message) {
          toast.error(json.message?.replaceAll("_", " "), { richColors: true });
        }
        if (json.data.warning) {
          toast.warning(json.data.warning, { richColors: true });
        }
        if (json.data.error) {
          toast.error(json.data.error, { richColors: true });
        }
        setDisabled(true);
      }
    };

    const getTiktokShippingParameter = async (orderSn: string) => {
      setTiktokShipError(undefined);
      try {
        const orderResponse =
          await Services.TransactionTiktokOrder?.getOrderDetail?.(orderSn);
        const orderJson = await orderResponse?.json();

        if (!orderResponse?.ok || !orderJson?.data) {
          throw new Error(
            orderJson?.message || "Gagal mengambil detail order TikTok",
          );
        }

        // Robust packageId: packages[0].id → any line_item.package_id
        const order = orderJson.data.orders?.[0];
        const packageId =
          order?.packages?.[0]?.id ??
          order?.line_items?.find((li: any) => li?.package_id)?.package_id ??
          null;

        if (!packageId) {
          throw new Error(
            "Tidak dapat menemukan TikTok package ID untuk order ini. Coba fetch ulang order.",
          );
        }

        setTiktokPackageId(packageId);

        const slotResponse =
          await Services.TransactionTiktokOrder?.getPackageHandoverTimeSlots?.(
            packageId,
          );
        const slotJson = await slotResponse?.json();

        // If the API itself errored, surface the message but don't block — some
        // packages use DROP_OFF and don't need a time slot.
        if (!slotResponse?.ok) {
          const errMsg = slotJson?.error ?? slotJson?.message ?? "Gagal mengambil timeslot pengambilan";
          // Still allow shipping without a slot (DROP_OFF / no-slot flow)
          setPickupTime([]);
          setDisabled(false);
          setTiktokShipError(`Timeslot tidak tersedia: ${errMsg}. Pengiriman mungkin tetap bisa diproses tanpa memilih slot.`);
          return;
        }

        const rawSlots = slotJson?.data?.pickup_slots ?? [];
        const slots = rawSlots
          .map((slot: any) => {
            const available = Boolean(
              slot.available ?? slot.avaliable ?? false,
            );
            const startTime = Number(slot.start_time ?? 0);
            const endTime = Number(slot.end_time ?? 0);
            return {
              ...slot,
              pickup_time_id: `${startTime}-${endTime}`,
              start_time: startTime,
              end_time: endTime,
              available,
              flags: [available ? "recommended" : "unavailable"],
              time_text:
                startTime && endTime
                  ? `${formatDateTime(new Date(startTime * 1000))} - ${formatDateTime(
                    new Date(endTime * 1000),
                  )}`
                  : "",
            } as TimeSlot;
          })
          .filter((slot: TimeSlot) => slot.available);

        if (slots.length === 0) {
          // No pickup slots — could be DROP_OFF handover method; still allow submit
          setPickupTime([]);
          setDisabled(false);
          setTiktokShipError("Tidak ada timeslot pengambilan tersedia. Pengiriman akan diproses tanpa memilih jadwal pickup.");
          return;
        }

        setPickupTime(slots);
        setDisabled(false);
      } catch (error) {
        if (error instanceof Error) {
          setTiktokShipError(error.message);
        }
        setDisabled(true);
      }
    };

    const fetchOrderItems = async (orderId: string) => {
      try {
        const res = await Services.TransactionOrder?.getOrderItems?.(orderId);
        const json: OrderItemsResponse = await res?.json();
        if (res?.ok) {
          setItems(json.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch order items:", error);
      }
    };

    const viewData = async () => {
      try {
        if (id) {
          const res = await Services.TransactionOrder?.show?.(id);
          const json: OrderViewResponse = await res?.json();
          if (res?.ok) {
            setData(json.data);
            setTotalAmount(
              json.data.total_amount ?? location.state?.total_amount,
            );
            setTotalShipping(json.data.total_shipping);
            fetchOrderItems(id);

            // Debug: log status and marketplace so we can diagnose shipping section visibility
            console.log('[OrderDetail] status:', json.data.status, '| marketplace:', json.data.marketplace?.code, '| marketplace_id:', json.data.marketplace_id);

            if (json.data.status == "ready_to_ship" || json.data.status == "ready_to_pickup") {
              switch (json.data.marketplace.code) {
                case "shopee":
                  if (json.data.status == "ready_to_ship") {
                    getShopeeShippingParameter(json.data.order_sn);
                  }
                  break;
                case "tiktok":
                case "tiktok_shop":
                  getTiktokShippingParameter(json.data.order_sn);
                  break;
                case "lazada":
                  break;
                default:
                  break;
              }
            }
          } else {
            toast.error(json?.message ?? "Gagal memuat data order", {
              richColors: true,
            });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { richColors: true });
          navigate(-1);
        }
      } finally {
        setLoading(false);
      }
    };
    viewData();
  }, [id]);

  React.useEffect(() => {
    if (addressId) {
      setPickupTime(
        shippingParameter?.find((item) => String(item.address_id) === addressId)
          ?.time_slot_list,
      );
    }
  }, [addressId]);

  React.useEffect(() => {
    form.setValue(
      "address_id",
      String(
        shippingParameter?.find((item) =>
          item.address_flag.includes("default_address"),
        )?.address_id || "",
      ),
    );
  }, [shippingParameter]);

  React.useEffect(() => {
    const defaultSlot =
      pickupTime?.find((item) => item.flags.includes("recommended")) ??
      pickupTime?.[0];

    if (defaultSlot) {
      form.setValue("pickup_time_id", String(defaultSlot.pickup_time_id));
    }
  }, [pickupTime]);

  const downloadTiktokDocument = async () => {
    if (!data?.order_sn) return;
    setDownloadingDoc(true);
    try {
      const res = await Services.TransactionTiktokOrder.downloadShippingDocument(
        { order_sn: data.order_sn },
      );
      if (res?.ok) {
        const filePath = await downloadFile(res);
        if (filePath) {
          toast.success(`Download selesai: ${filePath}`, {
            action: {
              label: "Buka",
              onClick: () => window.electronAPI.openFile(filePath),
            },
            richColors: true,
          });
        } else {
          toast.error("File path tidak valid", { richColors: true });
        }
      } else {
        const json = await res?.json().catch(() => null);
        let message = "Gagal mengunduh dokumen pengiriman";
        if (json?.error) {
          message = String(json.error);
          if (json?.code) message += ` (Kode: ${json.code})`;
        } else if (json?.message) {
          message = String(json.message);
        }
        toast.error(message, { richColors: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setDownloadingDoc(false);
    }
  };

  const submitShipping = async (
    values:
      | ShopeeShipOrder
      | {
        order_sn: string;
        pickup_time_id?: string;
        address_id?: string;
        dropoff?: object;
        marketplace_code?: string;
      },
  ) => {
    const marketplaceCode = values.marketplace_code || data?.marketplace?.code;
    switch (marketplaceCode) {
      case "shopee":
        if (values.dropoff != undefined) {
          return await Services.TransactionShopeeOrder.shipOrderShopee(
            {
              order_sn: values.order_sn,
              dropoff: values.dropoff
            }
          );
        } else return await Services.TransactionShopeeOrder.shipOrderShopee(
          values as ShopeeShipOrder,
        );
      case "tiktok":
      case "tiktok_shop": {
        if (!tiktokPackageId) {
          throw new Error(
            "Tidak ada package TikTok yang tersedia untuk dikirim",
          );
        }

        // If pickup slots are available, use PICKUP handover with selected slot.
        // If no slots (DROP_OFF / no-slot flow), ship without a pickup_slot.
        if (pickupTime && pickupTime.length > 0) {
          const selectedSlot = pickupTime?.find(
            (item) => item.pickup_time_id === values.pickup_time_id,
          );

          if (!selectedSlot?.start_time || !selectedSlot?.end_time) {
            throw new Error("Pilih waktu pengambilan TikTok terlebih dahulu");
          }

          return await Services.TransactionTiktokOrder.shipPackage(
            tiktokPackageId,
            {
              handover_method: "PICKUP",
              pickup_slot: {
                start_time: selectedSlot.start_time,
                end_time: selectedSlot.end_time,
              },
            },
          );
        } else {
          // No pickup slots available — attempt ship without slot (e.g. DROP_OFF)
          return await Services.TransactionTiktokOrder.shipPackage(
            tiktokPackageId,
            {
              handover_method: "DROP_OFF",
            },
          );
        }
      }
      case "lazada":
      default:
        return;
    }
  };

  const submitForm = async (values: any) => {
    setLoading(true);
    try {
      // Kondisi 1: Jika status order adalah ready_to_pickup (Proses Scan Barang)
      if (data?.status === "ready_to_pickup") {
        if (!data?.id) {
          toast.error("ID Order tidak ditemukan");
          return;
        }

        const missingBarcodes = expandedItems.some(
          (item) => !scannedBarcodes[`${item.sourceOrderItemId}-${item.sourceItemIndex}-${item.parsedIndex}`]
        );
        if (missingBarcodes) {
          toast.error("Harap isi semua barcode barang!");
          setLoading(false);
          return;
        }

        const barcodeValues = expandedItems.map(
          (item) => scannedBarcodes[`${item.sourceOrderItemId}-${item.sourceItemIndex}-${item.parsedIndex}`]
        );
        const uniqueBarcodes = new Set(barcodeValues);
        if (uniqueBarcodes.size !== barcodeValues.length) {
          toast.error("Terdapat barcode duplikat!");
          setLoading(false);
          return;
        }

        const orderItemsMap: Record<string, string[]> = {};
        expandedItems.forEach((item) => {
          const barcode = scannedBarcodes[`${item.sourceOrderItemId}-${item.sourceItemIndex}-${item.parsedIndex}`];
          if (!orderItemsMap[item.sourceOrderItemId]) {
            orderItemsMap[item.sourceOrderItemId] = [];
          }
          orderItemsMap[item.sourceOrderItemId].push(barcode);
        });

        const orderItemsPayload = Object.entries(orderItemsMap).map(
          ([id, barcodes]) => ({
            id,
            scanned_barcodes: barcodes,
          })
        );

        const formatToLaravelDatetime = (date: Date) => {
          const pad = (n: number) => String(n).padStart(2, "0");
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        const payload = {
          order_id: data.id,
          prepared_at: formatToLaravelDatetime(new Date()),
          order_items: orderItemsPayload,
        };

        const res = await Services.TransactionOrder.submitPreparation(payload);
        const json = await res?.json();
        if (res?.ok) {
          toast.success(json.message || "Berhasil memproses pickup barang!");
          navigate(-1);
        } else {
          toast.error(String(json.message?.replaceAll("_", " ") || "Gagal memproses pickup barang!"), {
            richColors: true,
          });
        }
      }
      // Kondisi 2: Jika status order ready_to_ship (Proses Atur Pengiriman Marketplace)
      else {
        if (data?.order_sn) {
          const res = await submitShipping({
            order_sn: data.order_sn,
            ...values,
          });

          if (!res) {
            throw new Error("Gagal memproses pengiriman");
          }

          const json = await res.json().catch(() => null);
          if (res.ok) {
            // TikTok can return HTTP 200 with a non-zero code indicating failure
            const tiktokCode = json?.code ?? 0;
            if (tiktokCode !== 0) {
              const errMsg = String(json?.message ?? "Gagal memproses pengiriman");
              // Check if it's a scope error
              if (errMsg.includes("denied") || errMsg.includes("scope") || errMsg.includes("authorized")) {
                toast.error(
                  `${errMsg} | SOLUSI: Re-authorize TikTok app dengan scope "order.fulfillment"`,
                  { richColors: true, duration: 8000 },
                );
              } else {
                toast.error(`${errMsg} (Kode: ${tiktokCode})`, { richColors: true });
              }
            } else {
              toast.success(json?.message ?? "Berhasil memproses pengiriman", {
                richColors: true,
              });
              navigate(-1);
            }
          } else {
            const errMsg = json?.error ?? json?.message;
            const fullMsg = String(errMsg?.replaceAll?.("_", " ") ?? "Gagal memproses pengiriman");
            // Check if it's a scope error
            if (fullMsg.includes("denied") || fullMsg.includes("scope") || fullMsg.includes("authorized")) {
              toast.error(
                `${fullMsg} | SOLUSI: Re-authorize TikTok app dengan scope "order.fulfillment"`,
                { richColors: true, duration: 8000 },
              );
            } else {
              toast.error(fullMsg, { richColors: true });
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { richColors: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm, console.log)}
        className={`flex flex-col flex-1 h-0 select-none gap-3 bg-muted/20 ${loading ? "cursor-progress" : undefined}`}
      >
        {/* Detail Ringkasan Atas */}
        <div className="px-6 md:px-8 py-5 bg-card border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={data?.status} />
              {data?.marketplace?.code && (
                <Badge variant="outline" className="capitalize gap-1.5">
                  <Store className="h-3 w-3" />
                  {data.marketplace.code}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {data?.order_sn ? `#${data.order_sn}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
            <InfoField icon={Hash} label="Nomor Seri Pesanan">
              <div className="flex items-center gap-2">
                <span className="wrap-break-word">{data?.order_sn || "-"}</span>
                {data?.order_sn && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => copyText(data.order_sn, "Nomor Seri Pesanan")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </InfoField>
            <InfoField icon={Truck} label="Nomor AWB">
              <div className="flex items-center gap-2">
                <span className="wrap-break-word">{data?.awb_code || "-"}</span>
                {data?.awb_code && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => copyText(data.awb_code, "AWB")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </InfoField>
            <InfoField icon={Store} label="Marketplace" className="capitalize">
              {data?.marketplace?.code || "-"}
            </InfoField>
            <InfoField icon={Package} label="Jumlah Item">
              {data?.item_count || 0}
            </InfoField>
            <InfoField icon={Wallet} label="Total Harga">
              {formatCurrency(totalAmount ?? data?.total_amount ?? data?.total_price)}
            </InfoField>
            <InfoField icon={Truck} label="Biaya Kirim">
              {formatCurrency(totalShipping ?? data?.total_shipping)}
            </InfoField>
            <InfoField icon={User} label="Nama Customer">
              {data?.customer_name || "-"}
            </InfoField>
            <InfoField icon={Phone} label="No. Telepon">
              {data?.customer_phone || "-"}
            </InfoField>
            <InfoField icon={MapPin} label="Alamat Pengiriman" className="col-span-2 md:col-span-4">
              {data?.customer_address || "-"}
            </InfoField>
          </div>
        </div>

        {/* List Detail Item */}
        <div className="px-6 md:px-8 py-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">Detail Item</h3>
            {uniqueOrderItems.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {uniqueOrderItems.length} item{uniqueOrderItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {uniqueOrderItems.length > 0 ? (
            <div className="space-y-3">
              {uniqueOrderItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3 pb-3 border-b">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold wrap-break-word">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {item.color && <Badge variant="outline" className="text-sm px-3 py-1.5">{item.color}</Badge>}
                      {item.size && <Badge variant="outline" className="text-sm px-3 py-1.5">{item.size}</Badge>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">Harga</p>
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">Diskon</p>
                      <p className="font-medium text-destructive">{formatCurrency(item.price - item.discounted_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">Harga Final</p>
                      <p className="font-semibold">{formatCurrency(item.discounted_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">Jumlah</p>
                      <p className="font-medium">{item.total_quantity || item.quantity_purchased || "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <PackageX className="h-8 w-8" />
              <p className="text-sm">Tidak ada item untuk ditampilkan</p>
            </div>
          )}
        </div>

        {/* FORM 1: Pengiriman Shopee (Hanya jika status ready_to_ship & marketplace Shopee) */}
        {data?.marketplace.code === "shopee" && data.status === "ready_to_ship" && (
          <div className="px-6 md:px-8 py-5 bg-card border-y">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold text-base">Pengiriman Shopee</h3>
            </div>
            <div className="space-y-4">
              {!disabled ? (
                <>
                  <FormField
                    control={form.control}
                    name="address_id"
                    render={({ field, fieldState }) => (
                      <FormItem className="py-2 flex-1">
                        <FormLabel className="flex items-center gap-1.5">
                          <MapPinned className="h-3.5 w-3.5" /> Alamat Pengambilan
                        </FormLabel>
                        <FormControl>
                          <Select value={String(field.value)} onValueChange={field.onChange} name={field.name} disabled={disabled}>
                            <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                              <div className="flex w-full text-left">
                                {(() => {
                                  const value = shippingParameter?.find((item) => String(item.address_id) === field.value);
                                  return value ? (
                                    <div className="flex gap-2">
                                      <p>{value.address}, {value.state}, {value.city}, {value.district}, {value.town}, {value.zipcode}</p>
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">Pilih alamat</p>
                                  );
                                })()}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {shippingParameter?.map((item, index) => (
                                <SelectItem key={index} value={String(item.address_id)} className="[&>span]:flex-1">
                                  <div className="flex-1 flex gap-3">
                                    <div className="flex flex-col flex-1 gap-0.5">
                                      <div><span className="text-muted-foreground">Alamat: </span>{item.address || "-"}</div>
                                      <div><span className="text-muted-foreground">Provinsi: </span>{item.state || "-"}</div>
                                      <div><span className="text-muted-foreground">Kota: </span>{item.city || "-"}</div>
                                    </div>
                                    <div className="flex flex-0 flex-col gap-1.5">
                                      {item.address_flag.map((flag, idx) => (
                                        <Badge variant="success" key={idx}>{flag.replaceAll("_", " ")}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Alamat pengambilan barang</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickup_time_id"
                    render={({ field, fieldState }) => (
                      <FormItem className="py-2">
                        <FormLabel className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Waktu Pengambilan
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} name={field.name} disabled={!pickupTime || disabled}>
                            <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                              <div className="flex w-full text-left">
                                {(() => {
                                  const value = pickupTime?.find((item) => item.pickup_time_id === field.value);
                                  return value ? <div className="flex gap-2"><p>{value.time_text}</p></div> : <p className="text-muted-foreground">Waktu pengambilan</p>;
                                })()}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {pickupTime?.map((item, index) => (
                                <SelectItem key={index} value={item.pickup_time_id} className="[&>span]:flex-1">
                                  <div className="flex-1 flex">
                                    <div className="flex flex-col flex-1">
                                      <div>{item.time_text || "-"}</div>
                                    </div>
                                    <div className="flex flex-0 flex-col gap-1.5">
                                      {item.flags.map((flag, idx) => (
                                        <Badge variant="success" key={idx}>{flag.replaceAll("_", " ")}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Waktu pengambilan barang</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-muted-foreground">
                  <PackageX className="h-4 w-4 shrink-0" />
                  <p className="text-sm">Tidak dapat memproses pengiriman untuk order ini</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(data?.marketplace.code === "tiktok" ||
          data?.marketplace.code === "tiktok_shop") &&
          (data.status === "ready_to_ship" ||
            data.status === "ready_to_pickup") && (
            <div className="px-6 md:px-8 py-5 bg-card border-y">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-bold text-base">Pengiriman TikTok</h3>
                </div>
                {/* Cetak Resi: only show once the package is ready for pickup (already arranged) */}
                {data.status === "ready_to_pickup" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={downloadingDoc}
                    onClick={downloadTiktokDocument}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {downloadingDoc ? "Mengunduh..." : "Cetak Resi"}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {disabled ? (
                  <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-muted-foreground">
                    <PackageX className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      {tiktokShipError ?? "Tidak dapat memproses pengiriman TikTok untuk order ini"}
                    </p>
                  </div>
                ) : (
                  <>
                    {tiktokShipError && (
                      <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-amber-700 dark:text-amber-400">
                        <PackageX className="h-4 w-4 shrink-0 mt-0.5" />
                        <p className="text-sm">{tiktokShipError}</p>
                      </div>
                    )}
                    {pickupTime && pickupTime.length > 0 && (
                      <FormField
                        control={form.control}
                        name="pickup_time_id"
                        render={({ field, fieldState }) => (
                          <FormItem className="py-2">
                            <FormLabel className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              Waktu Pengambilan
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                name={field.name}
                              >
                                <SelectTrigger
                                  aria-invalid={fieldState.invalid}
                                  className="w-full"
                                >
                                  <div className="flex w-full text-left">
                                    {(() => {
                                      const value = pickupTime?.find(
                                        (item) =>
                                          item.pickup_time_id == field.value,
                                      );
                                      return value ? (
                                        <div className="flex gap-2">
                                          <p>{value.time_text}</p>
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">
                                          Waktu pengambilan
                                        </p>
                                      );
                                    })()}
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {pickupTime?.map((item, index) => (
                                    <SelectItem
                                      key={index}
                                      value={item.pickup_time_id}
                                      className="[&>span]:flex-1"
                                    >
                                      <div className="flex-1 flex">
                                        <div className="flex flex-col flex-1">
                                          <div>
                                            {item.time_text !== ""
                                              ? item.time_text
                                              : "-"}
                                          </div>
                                        </div>
                                        <div className="flex flex-0 flex-col gap-1.5">
                                          {item.flags.map((flag, idx) => (
                                            <Badge variant="success" key={idx}>
                                              {flag.replaceAll("_", " ")}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Pilih jadwal pengambilan untuk TikTok Shipping.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}

        {/* FORM 3: Tabel Pickup & Scan Barcode (Hanya jika status ready_to_pickup) */}
        {data?.status === "ready_to_pickup" && (
          <div className="px-6 md:px-8 py-5 bg-card border-y space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold text-base">Pickup Barang (Ringkasan Order)</h3>
              </div>
              <div className="rounded-lg border overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3 text-right">Kuantitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getSkuSummary().map(({ sku, quantity }) => (
                      <tr key={sku} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{sku}</td>
                        <td className="px-4 py-3 text-right font-semibold">{quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-bold text-base">Rekomendasi Barcode & Pickup</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseAllRecommendations}
                  disabled={loadingRecommendations || items.length === 0}
                  className="text-xs h-8"
                >
                  Gunakan Semua Rekomendasi
                </Button>
              </div>

              <div className="rounded-lg border overflow-hidden bg-background">
                <table className="w-full text-sm text-left animate-in fade-in duration-300">
                  <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3 w-[60px] text-center">No</th>
                      <th className="px-4 py-3 w-1/4">SKU</th>
                      <th className="px-4 py-3 w-1/2">Rekomendasi Barcode (Gudang Kecil)</th>
                      <th className="px-4 py-3 w-1/4">Barcode Scan/Input</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {expandedItems.map((item, index) => {
                      const itemSku = (item.sku || "").toLowerCase();
                      const itemWarna = (item.warna || "").toLowerCase();
                      const itemUkuran = (item.ukuran || "").toLowerCase();
                      const recKey = `${itemSku}-${itemWarna}-${itemUkuran}`;

                      const indexInGroup = expandedItems
                        .slice(0, index)
                        .filter(
                          (i) =>
                            (i.sku || "").toLowerCase() === itemSku &&
                            (i.warna || "").toLowerCase() === itemWarna &&
                            (i.ukuran || "").toLowerCase() === itemUkuran
                        ).length;

                      const recs = barcodeRecommendations[recKey] || [];
                      const recommended = recs[indexInGroup] || "";
                      const key = `${item.sourceOrderItemId}-${item.sourceItemIndex}-${item.parsedIndex}`;
                      const scannedValue = scannedBarcodes[key] || "";

                      return (
                        <tr key={key} className="hover:bg-muted/30 align-middle">
                          <td className="px-4 py-3 text-center text-muted-foreground font-medium">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">
                            {item.sku}
                            {item.logo && <span className="text-[10px] text-muted-foreground ml-1.5">({item.logo})</span>}
                            {item.warna && <span className="text-[10px] text-muted-foreground ml-1.5">({item.warna})</span>}
                          </td>
                          <td className="px-4 py-3">
                            {loadingRecommendations ? (
                              <span className="text-muted-foreground text-xs italic animate-pulse">Memuat rekomendasi...</span>
                            ) : recommended ? (
                              <div className="flex items-center gap-2">
                                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary">{recommended}</code>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUseRecommendation(key, recommended)}
                                  className="h-6 px-1.5 text-[10px] text-primary hover:bg-primary/10"
                                >
                                  Gunakan
                                </Button>
                              </div>
                            ) : (
                              <span className="text-destructive text-xs italic font-medium">Tidak ada stok di Gudang Kecil</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={scannedValue}
                              placeholder="Scan / Ketik Barcode"
                              onChange={(e) => {
                                setScannedBarcodes((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-1.5 rounded-md border bg-background text-sm font-mono placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary border-input"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bagian Tombol Aksi Bawah */}
        <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-6 md:px-8 py-3">
          {/* TikTok ready_to_pickup: package already arranged, only offer download */}
          {(data?.marketplace.code === "tiktok" ||
            data?.marketplace.code === "tiktok_shop") &&
            data.status === "ready_to_pickup" ? (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Tutup
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={downloadingDoc}
                onClick={downloadTiktokDocument}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                {downloadingDoc ? "Mengunduh..." : "Cetak Resi"}
              </Button>
            </>
          ) : disabled || data?.status !== "ready_to_ship" ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              Tutup
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}