import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let passedValue = await new Response(request.body).text();
    let passedDate = passedValue.split('=').at(1);

    let data = new URLSearchParams();

    // @ts-ignore
    data.set("passedDate", passedDate);

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/report/v1/download/batchReport` ,{
        headers: request.headers,
        method: 'POST',
        body: data,
    })
    return await new Response(res.body);
}