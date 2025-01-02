import { Divider, Spacer } from "@nextui-org/react";
import ViewFilteredInvoices from "@/app/reports/filterPaidInvoices/ViewFilteredInvoices";
import React from "react";
import { LuFolderSearch } from "react-icons/lu";
import { BsFileEarmarkExcel } from "react-icons/bs";
import {Image} from "@nextui-org/image";
import * as XLSX from "xlsx";

export default function FilterPaidInvoicesMainContent() {
    const [invoiceData, setInvoiceData] = React.useState([]);

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
        const fileNameSelected = document.getElementById("toFilterPaidInvoices");
        if(file !== undefined){
            // setCurrentFile(fileNameSelected.files[0])
            const fileSelected = document.getElementById("fileSelected");
            // @ts-ignore
            fileSelected.hidden = false;
            const filterPaidInvoicesBtn = document.getElementById("filterPaidInvoicesBtn");
            // @ts-ignore
            filterPaidInvoicesBtn.hidden = false;
            const selectedFileName = document.getElementById('selectedFileName');
            // @ts-ignore
            selectedFileName.textContent = fileNameSelected.files[0].name;
        }

        let arrObj: any[] =[]
        reader.onload = (e) => {
            // @ts-ignore
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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
            })


        };
        reader.readAsArrayBuffer(file);
        // @ts-ignore
        setInvoiceData(arrObj);
    }


    return (
        <main>
            <div>
                <span className={'font-bold'}>Filter Paid Invoices</span>
                <br/>
                <Spacer y={2}/>
                <span className={"text-medium"}>Generating Commission Reports require a list of paid invoices
                    data that need to be saved to our database.</span>
                <br />
                <span>To begin, browse and select the spreadsheet file that contains a list of paid invoices.</span>
                <br />
                <Spacer y={2} />
                <span>Please note that an <strong>Excel file</strong> with correct formatting and file extension (<i>".xlxs"</i>) is required in order to successfully filter out
                    fully-paid invoices.</span>
                <Spacer y={2} />
                <div className="text-center m-auto mt-5">
                    <span className={"text-sm text-gray-600 dark:text-gray-500"}>
                        The following is an example of a properly formatted spreadsheet.
                    </span>
                    <Spacer y={1} />
                    <Image
                        className={"m-auto"}
                        alt="Proper Format Image"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/pngs/properFormatForPaidInvoiceFile.png`}
                        width={700}
                        removeWrapper
                        radius={"lg"}
                    />
                </div>
            </div>
            <Spacer y={16} />
            <div className={"flex flex-col space-y-4"}>
            <div className={"flex gap-5 h-fit border-t-small border-b-small px-5 py-3 border-default-200 dark:border-default-100"}>
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
                        id="toFilterPaidInvoices"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />

                </div>
                <div>
                    <Divider orientation={'vertical'} />
                </div>

                <div id={"fileSelected"} hidden={true}>
                    <div className={"flex items-center space-x-2"}>
                        <BsFileEarmarkExcel />
                        <span>Excel File Selected: {" "}</span>
                        <span id={"selectedFileName"}
                              className={"dark:bg-[#2b2d30] bg-gray-200 p-1 pl-2 pr-2 rounded"}></span>
                    </div>
                </div>
            </div>
            <div id={"filterPaidInvoicesBtn"} hidden={true}>
                <ViewFilteredInvoices parsedSelectedFile={invoiceData} />
            </div>
            </div>
        </main>
    );
}