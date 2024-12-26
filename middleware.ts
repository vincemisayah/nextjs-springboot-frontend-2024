import { NextRequest, NextResponse } from "next/server";
import { next } from "sucrase/dist/types/parser/tokenizer";

const isLoggedIn: boolean = true;
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'; // Fetch your token from your auth mechanism

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);

    // Add the Authorization header
    requestHeaders.set('Authorization', `Bearer ${token}`);

    const modifiedRequest = new Request(request.url, {
        method: request.method,
        headers: requestHeaders,
        body: request.body
    });

    return NextResponse.next({
        request: modifiedRequest,
    });
}
