import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const bodyText = await new Response(request.body).text();
    let data = new URLSearchParams(); // @ts-ignore
    data.append("username", "username"); // @ts-ignore
    data.append("password", "password");

    const url1 = `${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/authenticate`
    const res = await fetch(url1 ,{
        headers: request.headers,
        method: 'POST',
        body: bodyText,
    })

    return new Response(res.body);
}