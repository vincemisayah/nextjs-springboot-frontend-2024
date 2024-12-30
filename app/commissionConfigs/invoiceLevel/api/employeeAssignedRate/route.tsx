import { NextRequest, NextResponse } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const customerID = url.searchParams.get('customerID');
    const empID = url.searchParams.get('empID');
    const taskID = url.searchParams.get('taskID');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/customerlevel/employeeAssignedRate?customerID=${customerID}&empID=${empID}&taskID=${taskID}`,{
        headers:request.headers
    });

    // const body = await res.text();
    // console.log("IN ROUTE RES BODY: ", body);
    //
    const data = await res.json();



    // @ts-ignore
    return Response.json(data);
}