import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const cookiesList = cookies();
    cookiesList.delete('token');

    cookiesList.getAll().forEach((cookies) => {
        console.log('cookie name', cookies.name);
        cookiesList.delete(cookies.name)
    })

    console.log('cookie size: ', cookiesList.size)

    if(cookiesList.size === undefined || cookiesList.size < 1){
        return NextResponse.json({
            status:200,
            message:"Cookies deleted successfully",
        });
    }else{
        return NextResponse.json({
            status:400,
            message:"Some cookies failed to get deleted",
        });
    }
}