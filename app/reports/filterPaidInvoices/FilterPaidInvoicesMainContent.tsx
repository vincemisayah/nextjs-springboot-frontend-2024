import { Card, Skeleton, Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import ViewFilteredInvoices from "@/app/reports/filterPaidInvoices/ViewFilteredInvoices";
import React from "react";

export default function FilterPaidInvoicesMainContent() {
    const [currentFile, setCurrentFile] = React.useState<File | null>(null);

    const onFileSelectedHandler = ( ) =>{

        // console.log("click handler = ", document.getElementById("toFilterPaidInvoices"));
        const fileNameSelected = document.getElementById("toFilterPaidInvoices");
        // console.log(fileNameSelected.files[0])

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

    return (
        <main>
            <div className={'flex flex-col space-y-4'}>
                {/*<section>Filter Paid Invoices</section>*/}

                <div className={'flex gap-5 w-fit h-fit border-small px-5 py-3 rounded-small border-default-200 dark:border-default-100'}>
                    <div>
                        <label htmlFor="toFilterPaidInvoices" className="custom-file-upload">
                            Select Paid Invoices Excel File
                        </label>
                        <input type="file"
                               id="toFilterPaidInvoices"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                               onChange={onFileSelectedHandler}
                        />
                    </div>
                    <div id={'fileSelected'} hidden={true}>
                        File Selected: {' '}
                        <span id={"selectedFileName"} className={'dark:bg-[#2b2d30] bg-gray-200 p-1 pl-2 pr-2 rounded'}></span>
                    </div>
                </div>
                <div id={'filterPaidInvoicesBtn'} hidden={true}>
                    <ViewFilteredInvoices selectedFile={currentFile} />
                </div>
            </div>

        </main>
    );
}