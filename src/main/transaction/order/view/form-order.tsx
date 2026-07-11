import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod/v3";
import { formatDateTime } from "@/lib/format-date";
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
} from "lucide-react";

const schema = z.object({
  address_id: z.string().optional(),
  pickup_time_id: z.string(),
});

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
  const [totalAmount, setTotalAmount] = useState<number | undefined>(
    location.state?.total_amount,
  );
  const [totalShipping, setTotalShipping] = useState<number | undefined>();

  const [disabled, setDisabled] = useState<boolean>(true);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const addressId = useWatch({
    control: form.control,
    name: "address_id",
  });

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
        setShippingParameter(json.data.response.pickup.address_list);
        setDisabled(false);
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
      try {
        const orderResponse = await Services.TransactionTiktokOrder?.getOrderDetail?.(
          orderSn,
        );
        const orderJson = await orderResponse?.json();

        if (!orderResponse?.ok || !orderJson?.data) {
          throw new Error(
            orderJson?.message || "Gagal mengambil detail order TikTok",
          );
        }

        const packageId =
          orderJson.data.orders?.[0]?.packages?.[0]?.id ??
          orderJson.data.orders?.[0]?.line_items?.[0]?.package_id;
        if (!packageId) {
          throw new Error("Tidak dapat menemukan TikTok package ID untuk order ini");
        }

        setTiktokPackageId(packageId);

        const slotResponse =
          await Services.TransactionTiktokOrder?.getPackageHandoverTimeSlots?.(
            packageId,
          );
        const slotJson = await slotResponse?.json();

        if (!slotResponse?.ok || !slotJson?.data) {
          throw new Error(
            slotJson?.message || "Gagal mengambil timeslot pengambilan TikTok",
          );
        }

        const rawSlots = slotJson.data.pickup_slots ?? [];
        const slots = rawSlots
          .map((slot: any) => {
            const available =
              Boolean(slot.available ?? slot.avaliable ?? false);
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
          throw new Error("Tidak ada timeslot pengambilan TikTok yang tersedia");
        }

        setPickupTime(slots);
        setDisabled(false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, { richColors: true });
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
            if (json.data.status == "ready_to_ship") {
              switch (json.data.marketplace.code) {
                case "shopee":
                  getShopeeShippingParameter(json.data.order_sn);
                  break;
                case "tiktok":
                  getTiktokShippingParameter(json.data.order_sn);
                  break;
                case "lazada":
                  break;
                default:
                  break;
              }
            }
          } else {
            toast.error(json.message, { richColors: true });
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
        shippingParameter?.find((item) => String(item.address_id) == addressId)
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
        )?.address_id,
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

  const submitShipping = async (
    values: ShopeeShipOrder | {
      order_sn: string;
      pickup_time_id: string;
      address_id?: string;
    },
  ) => {
    switch (data?.marketplace.code) {
      case "shopee":
        return await Services.TransactionShopeeOrder.shipOrderShopee(
          values as ShopeeShipOrder,
        );
      case "tiktok": {
        if (!tiktokPackageId) {
          throw new Error("Tidak ada package TikTok yang tersedia untuk dikirim");
        }

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
      }
      case "lazada":

      default:
        return;
    }
  };

  const submitForm = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      if (data?.order_sn) {
        const res = await submitShipping({
          order_sn: data.order_sn,
          ...values,
        });

        if (!res) {
          throw new Error("Gagal memproses pengiriman");
        }

        const json = await res.json();
        if (res.ok) {
          toast.message(json.message);
          navigate(-1);
        } else {
          toast.error(String(json.message?.replaceAll("_", " ") ?? ""), {
            richColors: true,
          });
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
                    onClick={() =>
                      copyText(data.order_sn, "Nomor Seri Pesanan")
                    }
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
              {formatCurrency(
                totalAmount ?? data?.total_amount ?? data?.total_price,
              )}
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
            <InfoField
              icon={MapPin}
              label="Alamat Pengiriman"
              className="col-span-2 md:col-span-4"
            >
              {data?.customer_address || "-"}
            </InfoField>
          </div>
        </div>

        <div className="px-6 md:px-8 py-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">Detail Item</h3>
            {items.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3 pb-3 border-b">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold wrap-break-word">
                        {item.item_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {item.color && (
                        <Badge
                          variant="outline"
                          className="text-sm px-3 py-1.5"
                        >
                          {item.color}
                        </Badge>
                      )}
                      {item.size && (
                        <Badge
                          variant="outline"
                          className="text-sm px-3 py-1.5"
                        >
                          {item.size}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                        Harga
                      </p>
                      <p className="font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                        Diskon
                      </p>
                      <p className="font-medium text-destructive">
                        {formatCurrency(item.price - item.discounted_price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                        Harga Final
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(item.discounted_price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
                        Jumlah
                      </p>
                      <p className="font-medium">
                        {item.total_quantity || item.quantity_purchased || "-"}
                      </p>
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

        {data?.marketplace.code === "shopee" &&
          data.status === "ready_to_ship" && (
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
                            <MapPinned className="h-3.5 w-3.5" />
                            Alamat Pengambilan
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={String(field.value)}
                              onValueChange={field.onChange}
                              name={field.name}
                              disabled={disabled}
                            >
                              <SelectTrigger
                                aria-invalid={fieldState.invalid}
                                className="w-full"
                              >
                                <div className="flex w-full text-left">
                                  {(() => {
                                    const value = shippingParameter?.find(
                                      (item) =>
                                        String(item.address_id) == field.value,
                                    );
                                    return value ? (
                                      <div className="flex gap-2">
                                        <p>
                                          {value.address}, {value.state},{" "}
                                          {value.city}, {value.district},{" "}
                                          {value.town}, {value.zipcode}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="text-muted-foreground">
                                        Pilih alamat
                                      </p>
                                    );
                                  })()}
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {shippingParameter &&
                                  shippingParameter.map((item, index) => {
                                    return (
                                      <SelectItem
                                        key={index}
                                        value={String(item.address_id)}
                                        className="[&>span]:flex-1"
                                      >
                                        <div className="flex-1 flex gap-3">
                                          <div className="flex flex-col flex-1 gap-0.5">
                                            <div>
                                              <span className="text-muted-foreground">
                                                Alamat:{" "}
                                              </span>
                                              {item.address != ""
                                                ? item.address
                                                : "-"}
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">
                                                Provinsi:{" "}
                                              </span>
                                              {item.state != ""
                                                ? item.state
                                                : "-"}
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">
                                                Kota:{" "}
                                              </span>
                                              {item.city != ""
                                                ? item.city
                                                : "-"}
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">
                                                Kecamatan:{" "}
                                              </span>
                                              {item.district != ""
                                                ? item.district
                                                : "-"}
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">
                                                Kelurahan:{" "}
                                              </span>
                                              {item.town != ""
                                                ? item.town
                                                : "-"}
                                            </div>
                                            <div>
                                              <span className="text-muted-foreground">
                                                Kode Pos:{" "}
                                              </span>
                                              {item.zipcode != ""
                                                ? item.zipcode
                                                : "-"}
                                            </div>
                                          </div>
                                          <div className="flex flex-0 flex-col gap-1.5">
                                            {item.address_flag.map(
                                              (item, index) => (
                                                <Badge
                                                  variant="success"
                                                  key={index}
                                                >
                                                  {item.replaceAll("_", " ")}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Alamat pengambilan barang
                          </FormDescription>
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
                            <Clock className="h-3.5 w-3.5" />
                            Waktu Pengambilan
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              name={field.name}
                              disabled={!pickupTime || disabled}
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
                                {pickupTime &&
                                  pickupTime.map((item, index) => {
                                    return (
                                      <SelectItem
                                        key={index}
                                        value={item.pickup_time_id}
                                        className="[&>span]:flex-1"
                                      >
                                        <div className="flex-1 flex">
                                          <div className="flex flex-col flex-1">
                                            <div>
                                              {item.time_text != ""
                                                ? item.time_text
                                                : "-"}
                                            </div>
                                          </div>
                                          <div className="flex flex-0 flex-col gap-1.5">
                                            {item.flags.map((item, index) => (
                                              <Badge
                                                variant="success"
                                                key={index}
                                              >
                                                {item.replaceAll("_", " ")}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Waktu pengambilan barang
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-muted-foreground">
                    <PackageX className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      Tidak dapat memproses pengiriman untuk order ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {data?.marketplace.code === "tiktok" &&
          data.status === "ready_to_ship" && (
            <div className="px-6 md:px-8 py-5 bg-card border-y">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold text-base">Pengiriman TikTok</h3>
              </div>
              <div className="space-y-4">
                {!disabled && pickupTime?.length ? (
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
                            disabled={!pickupTime || disabled}
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
                                        {item.time_text != ""
                                          ? item.time_text
                                          : "-"}
                                      </div>
                                    </div>
                                    <div className="flex flex-0 flex-col gap-1.5">
                                      {item.flags.map((flag, index) => (
                                        <Badge
                                          variant="success"
                                          key={index}
                                        >
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
                ) : (
                  <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-muted-foreground">
                    <PackageX className="h-4 w-4 shrink-0" />
                    <p className="text-sm">
                      Tidak dapat memproses pengiriman TikTok untuk order ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-6 md:px-8 py-3">
          {disabled || data?.status !== "ready_to_ship" ? (
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
