import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    onPreviousPage: () => void;
    onNextPage: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export function Pagination({ onPreviousPage, onNextPage, hasNextPage, hasPreviousPage }: PaginationProps) {
    return (
        <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={onPreviousPage} disabled={!hasPreviousPage}>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Previous</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onNextPage} disabled={!hasNextPage}>
                <span className="mr-2">Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
