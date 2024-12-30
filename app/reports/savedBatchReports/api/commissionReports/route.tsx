import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/report/v1/savedBatchReports/2024`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}