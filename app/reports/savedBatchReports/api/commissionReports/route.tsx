export const revalidate = 60

export async function GET( ) {
    const res = await fetch(`${process.env.SERVER_API_ROUTE}/invoiceCommissionService/report/v1/savedBatchReports/2024`,{
        headers:{
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}