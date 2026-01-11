import { useEffect, useState } from "react";
import DataTable from "@/components/custom/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { BaseApiCallProps } from "@/interfaces/base";
import { toast } from "sonner";

interface OverviewProps<TData, TValue> {
    source: BaseApiCallProps<TValue>;
    columns: ColumnDef<TData, TValue>[];
    selectable?: boolean;
    actions?: (utils: { services: BaseApiCallProps<TValue>, onSubmit: () => void }) => React.ReactNode[];
    rowActions?: (cell: { row: TData, id: string | undefined, setId: React.Dispatch<React.SetStateAction<string | undefined>> }) => React.ReactNode;
    onLoadedRef?: (refreshFn: () => void) => void;
}

export default function OverviewPage<TData, TValue>({ source, columns, selectable, actions, rowActions, onLoadedRef }: OverviewProps<TData, TValue>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<string>("");
    const [data, setData] = useState<TData[]>();
    const [id, setId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const getData = async () => {
        try {
            const result = await source.master?.(page, pageSize, filter);
            const json = (await result?.json());
            if (result?.ok) {
                setData(json.data);
                setPage(json.pagination.current_page);
                setPageSize(json.pagination.per_page);
                setCount(json.pagination.total);
            } else {
                toast.error(json.message, { richColors: true })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { richColors: true })
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getData();
    }, [page, pageSize, filter]);
    useEffect(() => {
        onLoadedRef?.(getData);
    }, []);

    return <div className={`flex flex-col gap-4 py-4 md:gap-6 md:py-6 h-full select-none ${loading ? 'cursor-wait' : 'cursor-default'}`}>
        <div className="px-4 lg:px-6">
            <DataTable
                data={data ?? []}
                columns={columns}
                currentPage={page}
                count={count}
                perPage={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                selectable={selectable}
                loading={loading}
                actions={actions ? actions({ services: source, onSubmit: getData }) : []}
                rowActions={rowActions ? ({ row }) => (
                    rowActions({ row, id, setId })
                ) : undefined}
                filterComponents={
                    <Input
                        placeholder="Telusuri..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                } />
        </div>
    </div>
}