export const revalidate = 60

export async function GET( ) {
    const res = await fetch('http://localhost:1118/invoiceCommissionService/report/v1/savedBatchReports/2024',{
        headers:{
            "Content-Type": "application/json",
            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'
        }
    });
    const data = await res.json();
    // @ts-ignore
    return Response.json(data);
}