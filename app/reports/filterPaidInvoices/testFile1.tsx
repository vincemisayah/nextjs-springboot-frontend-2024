import { LuFolderSearch } from "react-icons/lu";
import React, { useRef } from "react";
import * as XLSX from 'xlsx';

const routeURL = `${process.env.NEXT_PUBLIC_BASE_URL}/reports/filterPaidInvoices/api/filterInvoices`

const TestFile1 = ( ) =>{
    const fileRef = useRef(null);
    const [invoiceData, setInvoiceData] = React.useState([]);

    // const sendData3 = async ( ) =>{
    //     let data = new URLSearchParams();
    //     // @ts-ignore
    //     data.append("name", "Daphne");
    //
    //     const response = await fetch(routeURL,{
    //         method: 'POST',
    //         body: data,
    //     });
    //
    //     const result = await response.json();
    //
    //     console.log("sendData3 Response = ", result );
    //
    // }

    // const sendData = async ( ) =>{
    //     if(invoiceData.length > 0){
    //         console.log(`SENDING DATA . . . ${JSON.stringify(invoiceData)}`)
    //         let data = new URLSearchParams();
    //         // @ts-ignore
    //         data.append("invoiceRowData", JSON.stringify(invoiceData));
    //
    //         const response = await fetch(routeURL,{
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // "Content-Length":""
    //             },
    //             method: 'POST',
    //             body: data,
    //         });
    //
    //         const result = await response.json();
    //
    //         console.log("sendData3 Response = ", result );
    //     }else{
    //         console.log("Nothing to send . . . ")
    //     }
    // }

    const sendData = async ( ) =>{
        if(invoiceData.length > 0){
            console.log(`SENDING DATA . . . ${JSON.stringify(invoiceData)}`)
            let data = new URLSearchParams();
            // @ts-ignore
            data.append("invoiceRowData", JSON.stringify(invoiceData));

            const response = await fetch(routeURL,{
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            console.log("sendData3 Response = ", result );
        }else{
            console.log("Nothing to send . . . ")
        }
    }

    function addDays(date:Date, days:number) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    }

    function ExcelDateToJSDate(serial: number) {
        var utc_days  = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);

        var fractional_day = serial - Math.floor(serial) + 0.0000001;

        var total_seconds = Math.floor(86400 * fractional_day);

        var seconds = total_seconds % 60;

        total_seconds -= seconds;

        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;

        let date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
        let adjustedDate = addDays(date, 1);

        let month = adjustedDate.getMonth() + 1;
        let year = adjustedDate.getFullYear();
        let day = adjustedDate.getDate();

        let monthStr = '';
        if(month < 10)
            monthStr = `0${month.toString()}`
        else
            monthStr = `${month.toString()}`


        let dayStr = '';
        if(day < 10)
            dayStr = `0${day.toString()}`
        else
            dayStr = `${day.toString()}`

        return (`${year}-${monthStr}-${dayStr}`)
    }


    const onFileSelectedHandler = (e: { target: { files: any[]; }; }) =>{
        const file = e.target.files[0];
        const reader = new FileReader();

        let arrObj: any[] =[]
        reader.onload = (e) => {
            // @ts-ignore
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log(jsonData[0]);

            const invoiceRowData = {
                invoiceID: '',
                invoiceDate: '',
                datePaid: '',
                total: '',
                amountPaid: '',
            }

            jsonData.forEach((row:any)=>{
                invoiceRowData.invoiceID   = row[0];
                invoiceRowData.invoiceDate = ExcelDateToJSDate(row[1]);
                invoiceRowData.datePaid    = ExcelDateToJSDate(row[2]);
                invoiceRowData.total       = row[3];
                invoiceRowData.amountPaid  = row[4];

                const deepCopyObj = JSON.parse(
                    JSON.stringify(invoiceRowData)
                );


                // arrObj.push(invoiceRowData);
                arrObj.push(deepCopyObj);
                console.log(`invoiceRowData = ${invoiceRowData.invoiceID}`);
            })


        };
        reader.readAsArrayBuffer(file);
        // @ts-ignore
        setInvoiceData(arrObj);
        console.log('arrObj = ', arrObj);
    }



    return(
        <div className={'flex flex-col gap-5'}>
            <div>
                <span>TEST FILE 1</span>
            </div>
            <div>
                <label htmlFor="toFilterPaidInvoices" className="custom-file-upload">
                    <div className={"flex items-center space-x-2"}>
                        <LuFolderSearch />
                        <span>Browse and select Paid Invoices Excel File</span>
                    </div>
                </label>

                {/*@ts-ignore*/}
                <input onChange={onFileSelectedHandler}
                       type="file"
                       ref={fileRef}
                       id="toFilterPaidInvoices"
                       accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} />
            </div>
            <div>{/*@ts-ignore*/}
                <button onClick={sendData}
                        className={"border-1 py-0.5 px-2 rounded"}>
                    <span className={'text-sm'}>Filter</span>
                </button>
            </div>

        </div>
    )
}
export default TestFile1;