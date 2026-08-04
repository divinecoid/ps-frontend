import { columns } from "./column";
import Services from "@/services";
import OverviewPage from "@/components/custom/overview-page";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ModalConfirm from "@/components/custom/modal-confirm";
import DropdownRowActions from "@/components/custom/dropdown-row-actions";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { useAcm } from "@/provider/acm-provider";
import ModalSeedDummy from "./modal-seed-dummy";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Product } from "@/interfaces/product";

export default function MasterProducts() {
    const [restoreRow, setRestoreRow] = useState<string | undefined>();
    const [deleteRow, setDeleteRow] = useState<string | undefined>();
    const { canUpdate, canDelete, canCreate } = useAcm("master_product");

    const paperWidthMm = 240;
    const paperHeightMm = 300;

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
        });
    };

    return <OverviewPage
        columns={columns}
        source={Services.MasterProduct}
        selectable={true}
        actions={(props) => [
            canCreate && <ModalSeedDummy key="seed-dummy" onSubmit={props.onSubmit} />,
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
}
