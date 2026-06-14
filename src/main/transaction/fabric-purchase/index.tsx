import OverviewPage from "@/components/custom/overview-page";
import Services from "@/services";
import { columns } from "./column";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Eye, Plus, Trash } from "lucide-react";
import { TooltipHover } from "@/components/custom/tooltip-hover";
import ModalConfirm from "@/components/custom/modal-confirm";
import { useState } from "react";
import { useAcm } from "@/provider/acm-provider";

export default function FabricPurchase() {
  const [deleteRow, setDeleteRow] = useState<string>();
  const [completeRow, setCompleteRow] = useState<string>();
  const { canCreate, canUpdate, canDelete } = useAcm("pembelian_kain");

  return (
    <>
      <OverviewPage
        columns={columns}
        source={Services.TransactionFabricPurchase}
        actions={(props) => [
          canCreate && (
            <Button asChild variant="outline">
              <Link to={`./new`}>
                <Plus />
                Pengajuan Baru
              </Link>
            </Button>
          ),
          canDelete && (
            <ModalConfirm
              {...props}
              action={Services.TransactionFabricPurchase.destroy}
              id={deleteRow}
              setId={setDeleteRow}
              variant="destructive"
              title="Apakah anda yakin untuk membatalkan pengajuan ini?"
              description="Pengajuan ini akan dibatalkan."
            />
          ),
          canUpdate && (
            <ModalConfirm
              {...props}
              action={Services.TransactionFabricPurchase.complete}
              id={completeRow}
              setId={setCompleteRow}
              title="Selesaikan pembelian kain?"
              description="Setelah selesai, pengajuan akan dikirim ke Gudang Kain dan tidak dapat diubah lagi."
            />
          ),
        ]}
        rowActions={({ row }) => (
          <div className="flex gap-2 justify-end">
            <TooltipHover tooltip="Lihat">
              <Button asChild variant="outline">
                <Link to={`./${row.id}`}>
                  <Eye />
                </Link>
              </Button>
            </TooltipHover>
            {canUpdate && row.status === "OPEN" && (
              <TooltipHover tooltip="Selesaikan">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setCompleteRow(row.id)}
                >
                  <Check />
                </Button>
              </TooltipHover>
            )}
            {canDelete && row.status === "OPEN" && (
              <TooltipHover tooltip="Hapus">
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => setDeleteRow(row.id)}
                >
                  <Trash />
                </Button>
              </TooltipHover>
            )}
          </div>
        )}
      />
    </>
  );
}
