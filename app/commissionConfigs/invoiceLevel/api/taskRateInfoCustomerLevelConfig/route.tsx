import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerID');
    const taskId = url.searchParams.get('taskID');
    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/customerlevel/taskRateInfo?customerID=${customerId}&taskID=${taskId}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}