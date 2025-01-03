import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const bodyText = await new Response(request.body).text();
    const searchParams = new URLSearchParams(bodyText);
    const empID = searchParams.get("empID");// @ts-ignore

    const invoiceRowData = searchParams.get("invoiceRowData");// @ts-ignore
    const arrayOfObjects = JSON.parse(invoiceRowData);

    // Recalculate content-length
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Content-Length', `${new Blob([JSON.stringify(arrayOfObjects)]).size}`);

    const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/fileUpload/v1/excelFile/parseRow?empID=${empID}`;
    const res = await fetch(url ,{
        headers:  requestHeaders,
        method: 'POST',
        body: JSON.stringify(arrayOfObjects),
    })
    return new Response(res.body);
}