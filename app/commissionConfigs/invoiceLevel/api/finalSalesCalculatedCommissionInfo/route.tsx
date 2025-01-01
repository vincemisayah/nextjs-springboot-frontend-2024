import { NextRequest } from "next/server";

export const revalidate = 3

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const customerID = url.searchParams.get('customerID');
    const invoiceID = url.searchParams.get('invoiceID');
    const taskID = url.searchParams.get('taskID');
    const orderNumber = url.searchParams.get('orderNumber');
    const employeeID = url.searchParams.get('employeeID');
    


    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/report/v1/salesEmployeeCommission?customerID=${customerID}&invoiceID=${invoiceID}&taskID=${taskID}&orderNumber=${orderNumber}&employeeID=${employeeID}`,{
        headers:request.headers
    });
    const data = await res.json();

    console.log('DATA: ', data);

    // @ts-ignore
    return Response.json(data);
}