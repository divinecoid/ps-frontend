import { useEffect, useState } from "react";
import DataTable from "@/components/custom/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { BaseApiCallProps } from "@/interfaces/base";

interface OverviewProps<TData, TValue> {
    source: BaseApiCallProps;
    columns: ColumnDef<TData, TValue>[];
    selectable?: boolean;
    actions?: (utils: { services: BaseApiCallProps, onSubmit: () => void }) => React.ReactNode[];
    rowActions?: (cell: { row: TData, id: number, setId: React.Dispatch<React.SetStateAction<number>> }) => React.ReactNode;
}

export default function OverviewPage<TData, TValue>({ source, columns, selectable, actions, rowActions }: OverviewProps<TData, TValue>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<string>("");
    const [data, setData] = useState<TData[]>();
    const [id, setId] = useState<number>();
    const getData = async () => {
        try {
            const result = await source.index(page, pageSize, filter);
            if (result.ok) {
                const json = (await result.json());
                setData(json.data);
                setPage(json.pagination.current_page);
                setPageSize(json.pagination.per_page);
                setCount(json.pagination.total);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getData();
    }, [page, pageSize, filter]);

    return <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
                actions={actions ? actions({ services: source, onSubmit: getData }) : []}
                rowActions={rowActions ? ({ row }) => (
                    rowActions({ row, id, setId })
                ): undefined}
                filterComponents={
                    <Input
                        placeholder="Search..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="max-w-sm"
                    />
                } />
        </div>
    </div>
}