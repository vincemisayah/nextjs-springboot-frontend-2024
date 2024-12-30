import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/customerlevel/invoiceDepartmentList`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}