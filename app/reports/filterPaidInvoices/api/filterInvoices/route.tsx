import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    // https://stackoverflow.com/questions/36005436/the-request-was-rejected-because-no-multipart-boundary-was-found-in-springboot
    request.headers.set('content-type', 'multipart/form-data; boundary=----WebKitFormBoundaryG8vpVejPYc8E16By');

    let bodyText = await new Response(request.body).text();
    const searchParams = new URLSearchParams(bodyText);
    const selectedFile = searchParams.get("file");
    const empIDStr = searchParams.get("empIDStr");

    console.log('file = ', selectedFile);
    // console.log('empIDStr = ', empIDStr);

    let data = new URLSearchParams();
    // @ts-ignore
    data.append("name", "name");

    console.log('DATA = ', data);
    // @ts-ignore
    // data.append("empIDStr", empIDStr);

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/fileUpload/v1/excelFile/filterPaidInvoices` ,{
        headers: request.headers,
        method: 'POST',
        body: data,
    })
    return new Response(res.body);
}