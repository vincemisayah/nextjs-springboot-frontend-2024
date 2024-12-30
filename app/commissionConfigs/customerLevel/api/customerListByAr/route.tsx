import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const arNumber = url.searchParams.get('arNumber');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/customerlevel/customerListByAr?arNumber=${arNumber}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}