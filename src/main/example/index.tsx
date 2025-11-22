import Datatable from "@/components/custom/datatable";
import { columns } from "./column";
import { Rack, RackResponse } from "@/interfaces/rack";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Services from "@/services";
import ModalAddExample from "./modal-add";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import ModalEditExample from "./modal-edit";

export default function Example() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<string>();
    const [data, setData] = useState<Rack[]>();

    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const getData = async () => {
        try {
            const result = await Services.MasterRack.index(page, pageSize, filter);
            if (result.ok) {
                const json: RackResponse = (await result.json());
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
            <ModalEditExample onSubmit={getData} setOpen={setViewModalOpen} open={isViewModalOpen} />
            <Datatable
                data={data ?? []}
                columns={columns}
                currentPage={page}
                count={count}
                perPage={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                selectable
                actions={[
                    <ModalAddExample open={isViewModalOpen} setOpen={setViewModalOpen} onSubmit={getData} />,
                ]}
                rowActions={({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => {setViewModalOpen(true)}}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
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