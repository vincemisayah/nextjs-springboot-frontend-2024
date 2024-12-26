export const revalidate = 3

export async function GET( ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/invoiceCommissionService/report/v1/savedBatchReports/2024`,{
        headers:{
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}