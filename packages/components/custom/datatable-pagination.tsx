import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface DatatablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function DatatablePagination({
    currentPage,
    totalPages,
    onPageChange
}: DatatablePaginationProps) {
    const generatePages = () => {
        const pages: number[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5];
        }
        if (currentPage >= totalPages - 3) {
            return [
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
    const pages = generatePages();
    return <Pagination className="select-none">
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                />
            </PaginationItem>
            {totalPages > 7 && currentPage > 4 && (
                <>
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(1)}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                </>
            )}
            {pages.map((page) => (
                <PaginationItem key={page}>
                    <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ))}
            {totalPages > 7 && currentPage < totalPages - 3 && (
                <>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(totalPages)}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                </>
            )}
            <PaginationItem>
                <PaginationNext
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                />
            </PaginationItem>
        </PaginationContent>
    </Pagination>
}