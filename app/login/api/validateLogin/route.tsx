import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    if(res.ok){
        const obj = await res.json();
        cookies().set('token', obj.GeneratedToken);
        return NextResponse.json({
            status:res.status,
            fullname: obj.Fullname,
            userID: obj.UserID,
        });
    }else{
        return NextResponse.json({
            status:res.status,
            fullname: undefined,
            userID: undefined,
        });
    }
}