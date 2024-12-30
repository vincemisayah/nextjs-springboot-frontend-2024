import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    let loginSuccess = false;

    // @ts-ignore
    if(request.cookies.get('token') !== undefined && request.cookies.get('token').value.length > 0){
        loginSuccess = true;
    }

    if(loginSuccess && request.url === `${process.env.NEXT_PUBLIC_BASE_URL}/`){
        return NextResponse.redirect(new URL("/reports", request.url));
    }

    if(loginSuccess){
        const jwtToken = request.cookies.get('token')?.value;
        const requestHeaders = new Headers(request.headers);
        // Add the Authorization header
        requestHeaders.set('Authorization', `Bearer ${jwtToken}`);

        const modifiedRequest = new Request(request.url, {
            method: request.method,
            headers: requestHeaders,
            body: request.body
        });

        return NextResponse.next({
            request: modifiedRequest,
        });
    }

    if(!loginSuccess &&
        (  request.url === `${process.env.NEXT_PUBLIC_BASE_URL}/`
        || request.url === `${process.env.NEXT_PUBLIC_BASE_URL}/reports`
        || request.url === `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel`
        || request.url === `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel`)
    ){
        return NextResponse.redirect(new URL("/login", request.url));
    }
}
