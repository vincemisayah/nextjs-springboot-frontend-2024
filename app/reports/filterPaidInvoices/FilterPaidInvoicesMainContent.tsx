import { Card, Divider, Skeleton, Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import ViewFilteredInvoices from "@/app/reports/filterPaidInvoices/ViewFilteredInvoices";
import React from "react";
import { FaFileExcel, FaFileInvoiceDollar } from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsFileEarmarkExcel } from "react-icons/bs";
import {Image} from "@nextui-org/image";
import { usePathname } from "next/navigation";
import TestFile1 from "@/app/reports/filterPaidInvoices/testFile1";

export default function FilterPaidInvoicesMainContent() {
    const [currentFile, setCurrentFile] = React.useState<File | any>(null);

    const onFileSelectedHandler = ( ) =>{
        const fileNameSelected = document.getElementById("toFilterPaidInvoices");
        if(fileNameSelected !== null){
            // @ts-ignore
            if(fileNameSelected.files[0] !== undefined){// @ts-ignore
                setCurrentFile(fileNameSelected.files[0])
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
        }
    }
    // return (
    //     <main>
    //         <div>
    //             <span className={'font-bold'}>Filter Paid Invoices</span>
    //             <br/>
    //             <Spacer y={2}/>
    //             <span className={"text-medium"}>Generating Commission Reports require a list of paid invoices
    //                 data that need to be saved to our database.</span>
    //             <br />
    //             {/*<Spacer y={2}/>*/}
    //             <span>To begin, browse and select the spreadsheet file that contains a list of paid invoices.</span>
    //             <br />
    //             <Spacer y={2} />
    //             <span>Please note that an <strong>Excel file</strong> with correct formatting and file extension (<i>".xlxs"</i>) is required in order to successfully filter out
    //                 fully-paid invoices.</span>
    //             <Spacer y={2} />
    //             <div className="text-center m-auto">
    //                 <span className={"text-sm text-gray-600 dark:text-gray-500"}>The following is an example of an excel file that our program can properly process.</span>
    //                 <Spacer y={1} />
    //                 <Image
    //                     className={"m-auto"}
    //                     alt="Proper Format Image"
    //                     src={process.env.NEXT_PUBLIC_BASE_URL + "pngs/properFormatForPaidInvoiceFile.png"}
    //                     width={700}
    //                     removeWrapper
    //                     radius={"lg"}
    //                 />
    //             </div>
    //         </div>
    //         <Spacer y={16} />
    //         <div className={"flex flex-col space-y-4"}>
    //         <div className={"flex gap-5 h-fit border-t-small border-b-small px-5 py-3 border-default-200 dark:border-default-100"}>
    //             <div>
    //                 <label htmlFor="toFilterPaidInvoices" className="custom-file-upload">
    //                     <div className={"flex items-center space-x-2"}>
    //                         <LuFolderSearch />
    //                         <span>Browse and select Paid Invoices Excel File</span>
    //                     </div>
    //                 </label>
    //                 <input type="file"
    //                        id="toFilterPaidInvoices"
    //                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //                        onChange={onFileSelectedHandler}
    //                 />
    //
    //             </div>
    //             <div>
    //                 <Divider orientation={'vertical'} />
    //             </div>
    //
    //             <div id={"fileSelected"} hidden={true}>
    //                 <div className={"flex items-center space-x-2"}>
    //                     <BsFileEarmarkExcel />
    //                     <span>Excel File Selected: {" "}</span>
    //                     <span id={"selectedFileName"}
    //                           className={"dark:bg-[#2b2d30] bg-gray-200 p-1 pl-2 pr-2 rounded"}></span>
    //                 </div>
    //
    //             </div>
    //         </div>
    //         <div id={"filterPaidInvoicesBtn"} hidden={true}>
    //             <ViewFilteredInvoices selectedFile={currentFile} />
    //         </div>
    //         </div>
    //     </main>
    // );

    return(
        <>

            <TestFile1/>
        </>
    );
}