// "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceDistinctTaskItems?invoiceID=" + props.invoiceNumber
import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const invoiceId = url.searchParams.get('invoiceId');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/invoiceLevel/invoiceDistinctTaskItems?invoiceID=${invoiceId}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}