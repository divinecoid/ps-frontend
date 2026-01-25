import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Services from "@/services";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function FormReceiveLogs() {
    const { id } = useParams();
    const navigate = useNavigate();
    React.useEffect(() => {
        const getData = async () => {
            try {
                if (id != undefined) {
                    const res = await Services.TransactionInbound.show(id);
                    const json = await res.json();

                    console.log(JSON.stringify(json.data))
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true });
                }
            }
        }
        getData();
    }, []);
    return <>
        <Tabs defaultValue="general">
            <TabsList>
                <TabsTrigger value="general">Informasi umum</TabsTrigger>
                <TabsTrigger value="items">Barang diterima</TabsTrigger>
                <TabsTrigger value="barcodes">Kode batang</TabsTrigger>
            </TabsList>
            <TabsContent value="items">
                {/* <Items rows={items} removeRow={setDeleteRow} /> */}
            </TabsContent>
            <TabsContent value="barcodes">
                {/* <Barcodes rows={barcodes} removeRow={setDeleteBarcodeRow} /> */}
            </TabsContent>
        </Tabs>
    </>
}