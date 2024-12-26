import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let bodyText = await new Response(request.body).text();
    const searchParams = new URLSearchParams(bodyText);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let data = new URLSearchParams();
    // @ts-ignore
    data.append("startDate", startDate);
    // @ts-ignore
    data.append("endDate", endDate);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/report/v1/saveToBatchReport` ,{
        headers: request.headers,
        method: 'POST',
        body: data,
    })
    return new Response(res.body);
}