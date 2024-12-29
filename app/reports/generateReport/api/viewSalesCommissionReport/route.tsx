import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    let bodyText = await new Response(request.body).text();
    const searchParams = new URLSearchParams(bodyText);
    const invoiceIDList = searchParams.get("invoiceIDs");
    const empID = searchParams.get("empID");

    let data = new URLSearchParams(); // @ts-ignore
    data.append("invoiceIDs", invoiceIDList); // @ts-ignore
    data.append("empID", empID);

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/report/v1/viewSalespersonPdfReport` ,{
        headers: request.headers,
        method: 'POST',
        body: data,
    })
    return new Response(res.body);
}