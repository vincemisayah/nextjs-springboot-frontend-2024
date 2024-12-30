import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const invoiceID = url.searchParams.get('invoiceID');
    const empID = url.searchParams.get('empID');
    const taskID = url.searchParams.get('taskID');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/invoiceLevel/employeeAssignedRate?invoiceID=${invoiceID}&empID=${empID}&taskID=${taskID}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}