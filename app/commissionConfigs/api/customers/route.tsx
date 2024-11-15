import { NextRequest } from "next/server";

export const revalidate = 60

export async function GET(request: NextRequest) {
  const dayCount = request.nextUrl.searchParams.get("dayCount");
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'fpAppserverService/invoiceCommission/customerList?dayCount=' + dayCount);
  const data = await res.json();
  // @ts-ignore
  return Response.json(data);
}