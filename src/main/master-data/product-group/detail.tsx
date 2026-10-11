import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { columns } from "../product/column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { Product } from "@/interfaces/product";
import { ProductGroup } from "@/interfaces/product-group";
import { BaseApiCallProps } from "@/interfaces/base";
import { toast } from "sonner";

export default function ProductGroupDetail() {
    const { id } = useParams();
    const [group, setGroup] = useState<ProductGroup>();
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const [printingGroup, setPrintingGroup] = useState(false);
    const { canUpdate, canDelete } = useAcm("master_product");

    const paperWidthMm = 240;
    const paperHeightMm = 300;

    useEffect(() => {
        if (!id) return;
        Services.MasterProductGroup.show(id).then(async (res) => {
            const json = await res.json();
            if (res.ok) setGroup(json.data);
        });
    }, [id]);

    const handlePrintAllInGroup = async () => {
        if (!id || !group) return;
        setPrintingGroup(true);
        try {
            const res = await Services.MasterProductGroup.products(id)(1, Math.max(group.qty, 1));
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
            await handlePrintBulk(products);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true });
            }
        } finally {
            setPrintingGroup(false);
        }
    };

    if (!id) return null;

    const source: BaseApiCallProps<Product> = {
        ...Services.MasterProduct,
        index: Services.MasterProductGroup.products(id),
        master: Services.MasterProductGroup.products(id),
    };

    const handlePrint = async (product: Product) => {
        await window.electronAPI.printPreview({
            barcodes: [{
                code: product.barcode,
                count: 1,
                serial_number: product.series || "",
                cutting: product.model?.name || "",
                sizes: product.size?.name || ""
            }],
            dozenBarcodes: [],
            paper: {
                width: paperWidthMm,
                height: paperHeightMm,
            },
            compact: true,
        });
    };

    const handlePrintBulk = async (products: Product[]) => {
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
    };

    return <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link to="/master-data/product"><ArrowLeft /></Link>
            </Button>
            <div className="flex-1">
                <h2 className="text-lg font-semibold">
                    {group?.model?.name} {group?.color?.name ? `- ${group.color.name}` : ""} {group?.size?.name ? `- ${group.size.name}` : ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Series {group?.series} &middot; {group?.qty ?? 0} produk
                </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2" disabled={!group || printingGroup} onClick={handlePrintAllInGroup}>
                <Printer className="h-4 w-4" /> Cetak Semua Grup ({group?.qty ?? 0})
            </Button>
        </div>
        <OverviewPage
            columns={columns}
            source={source}
            selectable={true}
            actions={(props) => [
                props.selectedRows.length > 0 && (
                    <Button key="bulk-print" variant="outline" className="flex items-center gap-2" onClick={() => handlePrintBulk(props.selectedRows as any)}>
                        <Printer className="h-4 w-4" /> Cetak Terpilih ({props.selectedRows.length})
                    </Button>
                ),
                canDelete && <DatatableSelectAction {...props} action={Services.MasterProduct.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} produk?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} produk terpilih dari daftar pilihan.`} />,
                canUpdate && <ModalConfirm {...props} action={Services.MasterProduct.restore} id={restoreRow} setId={setRestoreRow} title="Apakah anda yakin untuk mengembalikan produk ini?" description="Aksi ini akan memunculkan produk ini kembali ke dalam daftar pilihan." />,
                canDelete && <ModalConfirm {...props} action={Services.MasterProduct.destroy} id={deleteRow} setId={setDeleteRow} title="Apakah anda yakin untuk menghapus produk ini?" description="Aksi ini akan menghilangkan produk ini dari daftar pilihan." />
            ]}
            rowActions={({ row }) => (
                <DropdownRowActions>
                    {row.deleted_at ?
                        (canUpdate && <DropdownMenuItem onSelect={() => setRestoreRow(row.id)}>Kembalikan</DropdownMenuItem>)
                        : <>
                            <DropdownMenuItem onSelect={() => handlePrint(row as any)}>Cetak QR</DropdownMenuItem>
                            {canDelete && <DropdownMenuItem onSelect={() => setDeleteRow(row.id)}>Hapus</DropdownMenuItem>}
                        </>
                    }
                </DropdownRowActions>
            )} />
    </div>
}
