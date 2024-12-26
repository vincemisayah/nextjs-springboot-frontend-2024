import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/fileUpload/v1/excelFile/parseRow`;

    const bodyText = await new Response(request.body).text();
    const searchParams = new URLSearchParams(bodyText);
    const invoiceRowData = searchParams.get("invoiceRowData");// @ts-ignore
    const arrayOfObjects = JSON.parse(invoiceRowData);

    let data = new URLSearchParams(); // @ts-ignore
    data.append("invoiceRowData", JSON.stringify(arrayOfObjects));

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Content-Length', `${new Blob([JSON.stringify(arrayOfObjects)]).size}`);

    const res = await fetch(url ,{
        headers:  requestHeaders,
        method: 'POST',
        body: JSON.stringify(arrayOfObjects),
    })

    return new Response(res.body);
}