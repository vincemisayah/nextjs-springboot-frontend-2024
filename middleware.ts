import { NextRequest, NextResponse } from "next/server";

const isLoggedIn: boolean = true
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'

export function middleware(request: NextRequest) {
    if(isLoggedIn) {
        // Clone the request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.append("Authorization", `Bearer ${token}`);
        // requestHeaders.set("content-type", '');

        // Create a new request with the modified headers
        const modifiedRequest = new Request(request.url, {
            method: request.method,
            headers: requestHeaders,
            body: request.body
        });

        // Pass the modified request to the next handler
        return NextResponse.next({
            request: modifiedRequest,
        });
    }else{
        return NextResponse.redirect(new URL('/home', request.url));
    }
}