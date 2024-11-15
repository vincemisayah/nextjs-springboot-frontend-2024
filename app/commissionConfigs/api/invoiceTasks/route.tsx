export const revalidate = 60

export async function GET( ) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'fpAppserverService/invoiceCommission/taskList');
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}