import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const searchInput = url.searchParams.get('searchInput');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/invoiceLevel/searchInvoiceById?invoiceID=${searchInput}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}