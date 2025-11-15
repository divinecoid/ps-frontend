import Datatable from "@/components/custom/datatable";
import { columns } from "./column";
import { Rack, RackResponse } from "@/interfaces/rack";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MasterRack } from "@/services";

export default function Master_Racks() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState<string>();
    const [data, setData] = useState<Rack[]>();
    useEffect(() => {
        const getData = async () => {
            try {
                const result = await MasterRack.index();
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
        getData();
    }, [page, pageSize, filter]);

    return <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
            <Datatable
                data={data??[]}
                columns={columns}
                currentPage={page}
                count={count}
                perPage={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                selectable
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