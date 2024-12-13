import { Card, Skeleton } from "@nextui-org/react";
import React from "react";

const LoadingFilteredInvoicesSkeleton = () => {
    return (<div className={"skeleton"}>
        <Card className="w-[inherit] space-y-5 p-4" radius="lg">

            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-14 w-3/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-14 w-4/5 rounded-lg bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-14 w-2/5 rounded-lg bg-default-300" />
                </Skeleton>
            </div>
        </Card>
    </div>);
}
export default LoadingFilteredInvoicesSkeleton;