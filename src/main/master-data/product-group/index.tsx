import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { Link } from "react-router-dom";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import ModalSeedDummy from "../product/modal-seed-dummy";
import { useAcm } from "@/provider/acm-provider";
import { useState } from "react";
import { toast } from "sonner";
import { ProductGroup } from "@/interfaces/product-group";
import { Product } from "@/interfaces/product";

const paperWidthMm = 240;
const paperHeightMm = 300;

export default function MasterProductGroups() {
    const { canCreate } = useAcm("master_product");
    const [printingId, setPrintingId] = useState<string>();

    const handlePrintGroup = async (group: ProductGroup) => {
        setPrintingId(group.id);
        try {
            const res = await Services.MasterProductGroup.products(group.id)(1, Math.max(group.qty, 1));
            const json = await res.json();
            if (!res.ok) {
                toast.error(String(json.message || "Gagal memuat produk untuk dicetak"), { richColors: true });
                return;
            }
            const products: Product[] = json.data;
            if (products.length === 0) {
                toast.error("Tidak ada produk untuk dicetak pada grup ini", { richColors: true });
                return;
            }
            const barcodes = products.map((product) => ({
                code: product.barcode,
                count: 1,
                serial_number: product.series || "",
                cutting: product.model?.name || "",
                sizes: product.size?.name || ""
            }));

            await window.electronAPI.printPreview({
                barcodes,
                dozenBarcodes: [],
                paper: {
                    width: paperWidthMm,
                    height: paperHeightMm,
                },
                compact: true,
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            setPrintingId(undefined);
        }
    };

    return <OverviewPage
        columns={columns}
        source={Services.MasterProductGroup}
        actions={(props) => [
            canCreate && <ModalSeedDummy key="seed-dummy" onSubmit={props.onSubmit} />,
        ]}
        rowActions={({ row }) => (
            <div className="flex items-center gap-2">
                <TooltipHover tooltip="Cetak semua barcode di grup ini">
                    <Button
                        variant="outline"
                        disabled={printingId === row.id}
                        onClick={() => handlePrintGroup(row as any as ProductGroup)}
                    >
                        <Printer />
                    </Button>
                </TooltipHover>
                <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
            </div>
        )} />
}
