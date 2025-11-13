import Datatable from "@/components/custom/datatable";
import { columns } from "./column";
import { Rack } from "@/interfaces/rack";
import { useState } from "react";

const data: Rack[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
]
const response = {
    data: data,
    page: 1,
    perPage: 10,
    count: 80
}

export default function Master_Racks() {
    const [page, setPage] = useState(response.page);
    return <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
            <Datatable data={data} count={response.count} columns={columns} currentPage={page} perPage={response.perPage} onPageChange={setPage} />
        </div>
    </div>

}