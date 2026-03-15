import { BaseForm } from "@/interfaces/base";
import Services from "@/services";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod/v3";
import { formatDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressList, OrderViewResponse, ShopeeOrderShippingParameter, ShopeeShipOrder, TimeSlot, ViewOrderDetail } from "@/interfaces/order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
    address_id: z.string(),
    pickup_time_id: z.string()
})

export default function FormOrder(props: BaseForm) {
    const { id } = useParams();
    const [loading, setLoading] = React.useState<boolean>(id ? true : false);
    const navigate = useNavigate();

    const [data, setData] = useState<ViewOrderDetail>();
    const [shippingParameter, setShippingParameter] = useState<AddressList[]>();
    const [pickupTime, setPickupTime] = useState<TimeSlot[]>();

    const [disabled, setDisabled] = useState<boolean>(true);


    const form = useForm({
        resolver: zodResolver(schema),
    });

    const addressId = useWatch({
        control: form.control,
        name: "address_id"
    })

    React.useEffect(() => {
        const getShopeeShippingParameter = async (orderSn: string) => {
            const res = await Services.TransactionShopeeOrder?.getShopeeShippingParameter?.(orderSn);
            const json: ShopeeOrderShippingParameter = await res.json();
            if (res?.ok) {
                setShippingParameter(json.data.pickup.address_list);
                setDisabled(false);
            } else {
                toast.error(json.message.replaceAll('_', ' '), { richColors: true });
                setDisabled(false);//TODO: ganti true kalau udh selesai dev
                setShippingParameter([
                    {
                        "address_id": 291202,
                        "region": "ID",
                        "state": "DKI JAKARTA",
                        "city": "KOTA JAKARTA PUSAT",
                        "district": "CEMPAKA PUTIH",
                        "town": "",
                        "address": "Jalan Sudirman No. 10",
                        "zipcode": "10510",
                        "address_flag": [
                            "default_address",
                            "pickup_address",
                            "return_address"
                        ],
                        "time_slot_list": [
                            {
                                "date": 1771750800,
                                "time_text": "Now",
                                "pickup_time_id": "1771750800_2",
                                "flags": [
                                    "recommended"
                                ]
                            },
                            {
                                "date": 1771837200,
                                "time_text": "08:00 - 09:00",
                                "pickup_time_id": "1771837200_3",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "09:00 - 10:00",
                                "pickup_time_id": "1771837200_4",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "10:00 - 11:00",
                                "pickup_time_id": "1771837200_5",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "11:00 - 12:00",
                                "pickup_time_id": "1771837200_6",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "12:00 - 13:00",
                                "pickup_time_id": "1771837200_7",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "13:00 - 14:00",
                                "pickup_time_id": "1771837200_8",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "14:00 - 15:00",
                                "pickup_time_id": "1771837200_9",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "15:00 - 16:00",
                                "pickup_time_id": "1771837200_10",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "16:00 - 17:00",
                                "pickup_time_id": "1771837200_11",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "17:00 - 18:00",
                                "pickup_time_id": "1771837200_12",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "18:00 - 19:00",
                                "pickup_time_id": "1771837200_13",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "19:00 - 20:00",
                                "pickup_time_id": "1771837200_14",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "20:00 - 21:00",
                                "pickup_time_id": "1771837200_15",
                                "flags": []
                            },
                            {
                                "date": 1771837200,
                                "time_text": "21:00 - 22:00",
                                "pickup_time_id": "1771837200_16",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "08:00 - 09:00",
                                "pickup_time_id": "1771923600_3",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "09:00 - 10:00",
                                "pickup_time_id": "1771923600_4",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "10:00 - 11:00",
                                "pickup_time_id": "1771923600_5",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "11:00 - 12:00",
                                "pickup_time_id": "1771923600_6",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "12:00 - 13:00",
                                "pickup_time_id": "1771923600_7",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "13:00 - 14:00",
                                "pickup_time_id": "1771923600_8",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "14:00 - 15:00",
                                "pickup_time_id": "1771923600_9",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "15:00 - 16:00",
                                "pickup_time_id": "1771923600_10",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "16:00 - 17:00",
                                "pickup_time_id": "1771923600_11",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "17:00 - 18:00",
                                "pickup_time_id": "1771923600_12",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "18:00 - 19:00",
                                "pickup_time_id": "1771923600_13",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "19:00 - 20:00",
                                "pickup_time_id": "1771923600_14",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "20:00 - 21:00",
                                "pickup_time_id": "1771923600_15",
                                "flags": []
                            },
                            {
                                "date": 1771923600,
                                "time_text": "21:00 - 22:00",
                                "pickup_time_id": "1771923600_16",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "08:00 - 09:00",
                                "pickup_time_id": "1772010000_3",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "09:00 - 10:00",
                                "pickup_time_id": "1772010000_4",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "10:00 - 11:00",
                                "pickup_time_id": "1772010000_5",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "11:00 - 12:00",
                                "pickup_time_id": "1772010000_6",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "12:00 - 13:00",
                                "pickup_time_id": "1772010000_7",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "13:00 - 14:00",
                                "pickup_time_id": "1772010000_8",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "14:00 - 15:00",
                                "pickup_time_id": "1772010000_9",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "15:00 - 16:00",
                                "pickup_time_id": "1772010000_10",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "16:00 - 17:00",
                                "pickup_time_id": "1772010000_11",
                                "flags": []
                            },
                            {
                                "date": 1772010000,
                                "time_text": "17:00 - 18:00",
                                "pickup_time_id": "1772010000_12",
                                "flags": []
                            }
                        ]
                    }
                ]);
            }
        }
        const viewData = async () => {
            try {
                if (id) {
                    const res = await Services.TransactionOrder?.show?.(id);
                    const json: OrderViewResponse = await res?.json();
                    if (res?.ok) {
                        setData(json.data);
                        switch (json.data.marketplace.code) {
                            case 'shopee':
                                getShopeeShippingParameter(json.data.order_sn);
                                break;
                            case 'tiktok':
                                break;
                            case 'lazada':
                                break;
                            default:
                                break;
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
        }
        viewData();
    }, [id]);

    React.useEffect(() => {
        if (addressId) {
            setPickupTime(shippingParameter?.find(item => String(item.address_id) == addressId)?.time_slot_list)
        }
    }, [addressId]);

    const submitShipping = async (values: ShopeeShipOrder) => {
        switch (data?.marketplace.code) {
            case 'shopee':
                return await Services.TransactionShopeeOrder.shipOrderShopee(values);
            case 'tiktok':
            //TODO:
            case 'lazada':

            default:
                return;
        }
    }

    const submitForm = async (values: z.infer<typeof schema>) => {
        setLoading(true);
        try {
            if (data?.order_sn) {
                const res = await submitShipping({ order_sn: data.order_sn, ...values });
                const json = await res?.json();
                if (res?.ok) {
                    navigate(-1);
                } else {
                    toast.error(String(json.message.replaceAll('_', ' ')), { richColors: true });
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        } finally {
            setLoading(false);
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm, console.log)}
            className={`flex flex-col flex-1 h-0 select-none gap-4 ${loading ? 'cursor-progress' : undefined}`}>
            <div className="columns-1 lg:columns-2 gap-4">
                <div className="px-8 mt-4 mb-2 text-sm">
                    <div className="py-2 font-bold">Informasi Pemesanan</div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <p className="w-[200px] text-muted-foreground">Nomor Seri Pesanan</p>
                        <p className="font-medium">{data?.order_sn}</p>
                        <p className="w-[200px] text-muted-foreground">Nomor AWB</p>
                        <p className="font-medium">{data?.awb_code}</p>
                        <p className="w-[200px] text-muted-foreground">Waktu Baca</p>
                        <p className="font-medium">{data?.read_at ? formatDateTime(data.read_at) : '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Waktu Persiapan</p>
                        <p className="font-medium">{data?.prepared_at ? formatDateTime(data?.prepared_at) : '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Durasi Persiapan</p>
                        <p className="font-medium">{data?.prepare_duration}</p>
                    </div>
                </div>
                <div className="px-8 mt-4 mb-2 text-sm">
                    <div className="py-2 font-bold">Informasi Pemesanan</div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <p className="w-[200px] text-muted-foreground">Nomor Seri Pesanan</p>
                        <p className="font-medium">{data?.order_sn}</p>
                        <p className="w-[200px] text-muted-foreground">Nomor AWB</p>
                        <p className="font-medium">{data?.awb_code}</p>
                        <p className="w-[200px] text-muted-foreground">Status</p>
                        <p className="font-medium">{data?.status}</p>
                        <p className="w-[200px] text-muted-foreground">Waktu Baca</p>
                        <p className="font-medium">{data?.read_at ? formatDateTime(data.read_at) : '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Waktu Persiapan</p>
                        <p className="font-medium">{data?.prepared_at ? formatDateTime(data?.prepared_at) : '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Durasi Persiapan</p>
                        <p className="font-medium">{data?.prepare_duration ?? '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Ready To Ship</p>
                        <p className="font-medium">{data?.readytoship_at ? formatDateTime(data.readytoship_at) : '-'}</p>
                        <p className="w-[200px] text-muted-foreground">Ready To Ship Marketplace</p>
                        <p className="font-medium">{data?.readytoship_marketplace ?? '-'}</p>
                    </div>
                </div>
                <div className="px-8 mt-4 mb-2 text-sm">
                    <div className="py-2 font-bold">Informasi Produk</div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <p className="w-[200px] text-muted-foreground">Jumlah Item</p>
                        <p className="font-medium">{data?.item_count}</p>
                        <p className="w-[200px] text-muted-foreground">Jumlah Produk Unik</p>
                        <p className="font-medium">{data?.unique_item_count}</p>
                        <p className="w-[200px] text-muted-foreground">Total Berat</p>
                        <p className="font-medium">{data?.total_weight}</p>
                        <p className="w-[200px] text-muted-foreground">Total Harga</p>
                        <p className="font-medium">{data?.total_price}</p>
                        <p className="w-[200px] text-muted-foreground">Total Ongkir</p>
                        <p className="font-medium">{data?.total_shipping}</p>
                    </div>
                </div>
                <div className="px-8 mt-4 mb-2 text-sm">
                    <div className="py-2 font-bold">Preparist</div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <p className="w-[200px] text-muted-foreground">Nama</p>
                        <p className="font-medium">{data?.preparist_user?.name}</p>
                        <p className="w-[200px] text-muted-foreground">User ID</p>
                        <p className="font-medium">{data?.preparist_user_id}</p>
                    </div>
                </div>
                <div className="px-8 mt-4 mb-2 text-sm">
                    <div className="py-2 font-bold">Informasi Customer</div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <p className="w-[200px] text-muted-foreground">Nama</p>
                        <p className="font-medium">{data?.customer_name}</p>
                        <p className="w-[200px] text-muted-foreground">Telepon</p>
                        <p className="font-medium">{data?.customer_phone}</p>
                        <p className="w-[200px] text-muted-foreground">Alamat</p>
                        <p className="font-medium">{data?.customer_address}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 px-7 gap-4 overflow-y-auto">
                <FormField
                    control={form.control}
                    name="address_id"
                    render={({ field, fieldState }) => (
                        <FormItem className="py-2 flex-1">
                            <FormLabel>Alamat Pengambilan</FormLabel>
                            <FormControl>
                                <Select
                                    value={String(field.value)}
                                    onValueChange={field.onChange}
                                    name={field.name}
                                    disabled={disabled}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
                                        <div className="flex w-full text-left">
                                            {(() => {
                                                const value = shippingParameter?.find(item => String(item.address_id) == field.value);
                                                return value ? <div className="flex gap-2">
                                                    <p>{value.address} - {value.state} - {value.district} - {value.city} - {value.town} - {value.zipcode}</p>
                                                </div> : <></>
                                            })()}
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shippingParameter && shippingParameter.map((item, index) => {
                                            return <SelectItem key={index} value={String(item.address_id)} className="[&>span]:flex-1 p-2">
                                                <div className="flex-1 flex">
                                                    <div className="flex flex-col flex-1">
                                                        <div>{item.address}</div>
                                                        <div>{item.state}</div>
                                                        <div>{item.district}</div>
                                                        <div>{item.city}</div>
                                                        <div>{item.town}</div>
                                                        <div>{item.zipcode}</div>
                                                    </div>
                                                    <div className="flex flex-0 flex-col gap-2">
                                                        {item.address_flag.map(item => (
                                                            <Badge variant="success">{item.replaceAll('_', ' ')}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        })}
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
                            <FormLabel>Waktu Pengambilan</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    name={field.name}
                                    disabled={!pickupTime || disabled}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue
                                            placeholder="Waktu pengambilan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pickupTime && pickupTime.map((item, index) => {
                                            return <SelectItem key={index} value={item.pickup_time_id}>{item.time_text}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>Waktu pengambilan barang</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="sticky bottom-0 border-t backdrop-blur-md bg-background/70 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-end px-7 py-2">
                {disabled ? (
                    <Button type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Tutup</Button>
                ) : (
                    <>
                        <Button variant="outline" type="button" onClick={(e) => { e.preventDefault(); navigate(-1) }}>Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </>
                )}
            </div>
        </form>
    </Form>
}