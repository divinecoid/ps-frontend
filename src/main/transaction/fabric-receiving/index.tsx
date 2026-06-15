import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Eye, Trash } from "lucide-react";
import OverviewPage from "@/components/custom/overview-page";
import Services from "@/services";
import { columns } from "../fabric-cutting/column";
import ModalConfirm from "@/components/custom/modal-confirm";
import DatatableSelectAction from "@/components/custom/datatable-select-action";
import { TooltipHover } from "@/components/custom/tooltip-hover";

export default function FabricReceiving() {
  const [deleteRow, setDeleteRow] = useState<string>();
  const [receivedRow, setReceivedRow] = useState<string>();

  return (
    <OverviewPage
      columns={columns}
      source={Services.TransactionFabricCutting}
      actions={(props) => [
        <DatatableSelectAction {...props} action={Services.TransactionFabricCutting.multiDestroy} trigger="Hapus" variant="destructive" title={`Apakah anda yakin untuk menghapus ${props.selectedRows.length} pengajuan?`} description={`Aksi ini akan menghilangkan ${props.selectedRows.length} pengajuan terpilih dari daftar pilihan.`} />,
        <Button asChild variant="outline"><Link to={`./new`}><Eye />Lihat Detail</Link></Button>,
        <ModalConfirm {...props} action={Services.TransactionFabricCutting.setReceived} id={receivedRow} setId={setReceivedRow} variant="default" title="Apakah anda yakin untuk menerima pengajuan ini?" description="Aksi ini akan menandai seluruh detail sebagai diterima." />,
        <ModalConfirm {...props} action={Services.TransactionFabricCutting.destroy} id={deleteRow} setId={setDeleteRow} variant="destructive" title="Apakah anda yakin untuk membatalkan pengajuan ini?" description="Pengajuan ini akan dibatalkan." />,
      ]}
      rowActions={({ row }) => (
        <div className="flex gap-2 justify-end">
          <TooltipHover tooltip="Lihat"><Button asChild variant="outline"><Link to={`./${row.id}`}><Eye /></Link></Button></TooltipHover>
          {row.request_detail.every(
            (detail: any) =>
              detail.req_dozen_qty === detail.rec_dozen_qty &&
              detail.req_piece_qty === detail.rec_piece_qty
          ) ? (
            <></>
          ) : (
            <>
              <TooltipHover tooltip="Terima Semua"><Button variant="outline" onClick={() => setReceivedRow(row.id)}><Check /></Button></TooltipHover>
              <TooltipHover tooltip="Hapus"><Button variant="destructive" className="cursor-pointer" onClick={() => setDeleteRow(row.id)}><Trash /></Button></TooltipHover>
            </>
          )}
        </div>
      )}
    />
  );
}
