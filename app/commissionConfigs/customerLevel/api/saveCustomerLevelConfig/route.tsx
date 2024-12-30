import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const bodyText = await new Response(request.body).text();
    const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/customerlevel/saveCustomerLevelConfig`;
    const res = await fetch(url ,{
        headers:  request.headers,
        method: 'POST',
        body: bodyText,
    })
    return new Response(res.body);
}