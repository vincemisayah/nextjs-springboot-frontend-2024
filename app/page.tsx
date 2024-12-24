// 'use client'
import { headers } from 'next/headers'

export default function Home() {

  // const url = 'http://localhost:1118/invoiceCommissionService/report/v1/savedBatchReports/2024'
  // const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'
  // const config = {
  //   headers: {
  //     'Authorization': 'Bearer ' + token,
  //     'Content-Type': 'application/json',
  //     // Add any other headers you need
  //   }
  // };
  //
  // axios.get(url, config)
  //     .then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  const getData = ( ) =>{
    // fetch('http://localhost:1118/invoiceCommissionService/report/v1/savedBatchReports/2024', {
    //   headers: {
    //     'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'
    //   }
    // })
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.json(); // Assuming the response is in JSON format
    //     })
    //     .then(data => {
    //       // Handle the data
    //       console.log(data);
    //     })
    //     .catch(error => {
    //       // Handle errors
    //       console.error('Error:', error);
    //     });

    const url = 'http://localhost:1118/invoiceCommissionService/report/v1/savedBatchReports/2024'
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGaXNoZXIgUHJpbnRpbmcgSW5jLiIsInN1YiI6Im1taXNheWFoIiwiaWF0IjoxNzM0OTMwOTMxLCJleHAiOjE3NjAxMzA5MzF9.Yxq8KNBXD_Mpvgx_Z4fCHuu2lFm_Z53qPtkm405uyFXecix6IiXERXKTnHmYiZfOYnhgJVS9BRMowhhKILrutA'

    fetch(url, {
      mode: 'no-cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });


  }

  async function fetchData() {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    const res = await fetch('/api/data', {
      headers: {
        Authorization: authHeader || ''
      }
    })

    const data = await res.json()
    return data
  }



  return (

    <>
      <main>
        <div className="flex w-full flex-col">
          {/*<button onClick={getData}*/}
          {/*    className={'border-1 w-fit p-2 rounded'}>Get Data</button>*/}
        </div>
      </main>
    </>
  );
}
