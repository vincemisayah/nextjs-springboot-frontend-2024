import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const deptId = url.searchParams.get('deptId');

    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/customerlevel/invoiceTaskItemListByDeptId?deptId=${deptId}`,{
        headers:request.headers
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}