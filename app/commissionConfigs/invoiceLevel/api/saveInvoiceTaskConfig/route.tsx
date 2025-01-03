// http://localhost:1118/invoiceCommissionService/invoiceLevel/saveInvoiceTaskConfig

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const bodyText = await new Response(request.body).text();
    const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/invoiceLevel/saveInvoiceTaskConfig`;
    const res = await fetch(url ,{
        headers:  request.headers,
        method: 'POST',
        body: bodyText,
    })
    return new Response(res.body);
}