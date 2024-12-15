import {
    Accordion,
    Card,
    Divider,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    Spacer,
    Spinner
} from "@nextui-org/react";
import { File } from "node:buffer";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import LoadingFilteredInvoicesSkeleton from "@/app/reports/filterPaidInvoices/LoadingFilteredInvoicesSkeleton";
import { AccordionItem } from "@nextui-org/accordion";
import DisplayInvoiceList from "@/app/reports/filterPaidInvoices/DisplayInvoiceList";
import { FaFileInvoiceDollar } from "react-icons/fa";
import DisplayArrayOfObjectsAsTable from "@/components/DisplayArrayOfObjectsAsTable";
import { LuFilter } from "react-icons/lu";
import { ScrollShadow } from "@nextui-org/scroll-shadow";


interface ViewFilteredInvoicesProps {
    selectedFile?: File | any;
}

const ViewFilteredInvoices = ({ selectedFile }: ViewFilteredInvoicesProps) => {
    const [loggedIn, setLoggedIn] = useState(3667);
    const [isFetching, setIsFetching] = useState(false);
    const [shortPaidInvoices, setShortPaidInvoices] = useState([]);
    const [fullyPaidInvoices, setFullyPaidInvoices] = useState([]);
    const [overPaidInvoices, setOverPaidInvoices] = useState([]);

    const [viewFullyPaidInvoices, setViewFullyPaidInvoices] = useState([]);
    const [viewShortPaidInvoices, setViewShortPaidInvoices] = useState([]);
    const [viewOverPaidInvoices, setViewOverPaidInvoices] = useState([]);

    const [duplicateInvoices, setDuplicateInvoices] = useState([]);

    const [savingFullyPaid, setSavingFullyPaid] = useState(false);
    const [savingOverPaid, setSavingOverPaid] = useState(false);
    const [savingShortPaid, setSavingShortPaid] = useState(false);

    const [failedToSaveInvoices, setFailedToSaveInvoices] = useState([]);

    const postData = async ( ) =>{
        setShortPaidInvoices([]);
        setFullyPaidInvoices([]);
        setOverPaidInvoices([]);
        setViewFullyPaidInvoices([]);
        setViewShortPaidInvoices([]);
        setViewOverPaidInvoices([]);
        setDuplicateInvoices([]);
        setFailedToSaveInvoices([]);

        if(selectedFile !== null){
            console.log("postData selectedFile = ", selectedFile);

            let data = new FormData();
            // @ts-ignore
            data.append('file', selectedFile);
            data.append('empIDStr', loggedIn.toString( ));

            setIsFetching(true);

            await fetch('http://localhost:1118/invoiceCommissionService/fileUpload/v1/excelFile/filterPaidInvoices',{
                method: 'POST',
                body: data,
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response is JSON
            })
                .then(data => {
                    setIsFetching(false);
                    console.log(data);
                    setShortPaidInvoices(data.ShortPaidInvoices);
                    setFullyPaidInvoices(data.FullyPaidInvoices);
                    setOverPaidInvoices(data.OverPaidInvoices);
                    setViewFullyPaidInvoices(data.ViewableFullyPaidInvoices);
                    setViewShortPaidInvoices(data.ViewableShortPaidInvoices);
                    setViewOverPaidInvoices(data.ViewableOverPaidInvoices);
                    setDuplicateInvoices(data.InvoiceDupsFound);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
    }

    const titleInfo = (msg:string) =>{
        return(
            <div className={"flex items-center space-x-2"}>
                <FaFileInvoiceDollar />
                <span>{msg}</span>
            </div>
        )
    }

    const showSaveMsg = (idName:string, second:any) =>{
        const saveMsg = document.getElementById(idName);
        if(saveMsg !== null){
            saveMsg.style.opacity = '85%';
            setTimeout(() => {
                saveMsg.style.opacity = '0';
            }, second);
        }
    }

    const showWarningSaveMsg = (idName:string, second:any) =>{
        const saveMsg = document.getElementById(idName);
        if(saveMsg !== null){
            saveMsg.hidden = false;
            setTimeout(() => {
                saveMsg.style.opacity = '100%';
            }, 50);

            // setTimeout(() => {
            //     saveMsg.style.opacity = '0%';
            //     saveMsg.hidden = true;
            // }, 5000);
        }
    }

    const saveInvoiceData = async (idName:string, idName2:string, invoiceData:any, setIsSaving: ((arg0: boolean) => void) | undefined) =>{
        if (setIsSaving) {
            setIsSaving(true);
        }
        await fetch('http://localhost:1118/invoiceCommissionService/fileUpload/v1/excelFile/saveInvoiceData',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(invoiceData),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
                if (setIsSaving)
                    setIsSaving(false);
                if(data.SavedInvoicesCount === invoiceData.length){
                    showSaveMsg(idName, 2000);
                }
                else if(data.SavedInvoicesCount < invoiceData.length){
                    showWarningSaveMsg(idName2, 2000);
                    setFailedToSaveInvoices(data.UnsavedInvoices)
                }
                console.log("Unsaved Invoices = ", data.UnsavedInvoices);
        }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
        });
    }

    const WarningMessage = ( ) =>{
        const closeWarningMessage = ( ) =>{
            console.log("Closing warning message");
            const warningSaveMsgFullyPaid = document.getElementById('warningSaveMsgFullyPaid');
            warningSaveMsgFullyPaid.style.opacity = '0';
            setTimeout(()=>{
                warningSaveMsgFullyPaid.hidden = true;
            }, 1000)

        }

        return(
            <>
                <div hidden={false} id={"warningSaveMsgFullyPaid"}
                     className={"opacity-100 " +
                         "max-w-56 transition-opacity ease-out text-start " +
                         "rounded-md p-1 bg-yellow-300  " +
                         "text-yellow-700 dark:bg-yellow-950 dark:border-1 dark:border-yellow-500 dark:text-yellow-200"}>
                    <div className={"flex flex-row gap-32"}>
                        <span className={"text-sm font-bold"}>Warning</span>
                        <button onClick={closeWarningMessage}
                            className={"dark:border-1 dark:border-yellow-500 px-2 rounded"}>x</button>
                    </div>

                    <br />
                    <span className={"text-sm"}>The following invoice IDs failed to save because they do not
                                                            match with any existing invoices in our database.</span>

                    {failedToSaveInvoices.length > 0 ? (
                        <div className="dark:bg-yellow-950 dark:border-1 dark:border-yellow-500 max-h-40  overflow-auto">
                            <ol className={"ml-5 text-sm "}>
                                {failedToSaveInvoices.map((invoiceID, index) => (
                                    <li key={index}>{index + 1}. {invoiceID}</li>
                                ))}
                            </ol>
                        </div>) : null}
                </div>
            </>
        )
    }

    return (
        <>
            <div className={"flex flex-col gap-4"}>
                <div>
                    <Button onPress={() => {
                        postData();
                    }}
                            radius={"sm"}>
                        <LuFilter />
                        <span>Filter Paid Invoices</span>
                    </Button>
                </div>

                {isFetching ? <LoadingFilteredInvoicesSkeleton /> :
                    (fullyPaidInvoices.length > 0) ?
                        <>
                            {duplicateInvoices.length > 0 ? (
                                <div
                                    className={"w-fit flex flex-row border-t-small border-b-small items-center pt-4 pb-4 p-2 border-default-200 dark:border-default-100"}>
                                    <div className={"w-80 flex flex-row h-fit"}>
                                        <span className={"text-[10pt] justify-start p-1"}>
                                            Your file contained {duplicateInvoices.length} duplicated invoice IDs.
                                            <br />
                                            <Spacer y={1} />
                                            The duplicates of the listed invoices (shown right) are removed after the filtering process.
                                        </span>
                                    </div>
                                    <div className={"pl-3 border-l-small border-default-200 dark:border-default-100"}>
                                        <DisplayArrayOfObjectsAsTable list={duplicateInvoices} />
                                    </div>
                                </div>
                            ) : null}

                            <Accordion selectionMode="multiple">
                                <AccordionItem key="1" aria-label="Accordion 1"
                                               title={titleInfo("Fully Paid Invoices")}>
                                {viewFullyPaidInvoices.length > 0 ? (
                                            <div className={"flex space-x-5 w-56"}>
                                                <DisplayInvoiceList invoiceList={viewFullyPaidInvoices} />
                                                <div
                                                    className={"flex flex-col space-y-2 border-l-small px-3 py-3 dark:border-default-100"}>
                                                    <span
                                                        className={"text-sm"}>Invoice Count: {viewFullyPaidInvoices.length}</span>
                                                    <Button radius={"sm"}
                                                            onClick={() => saveInvoiceData("successSaveMsgFullyPaid", "warningSaveMsgFullyPaid", fullyPaidInvoices, setSavingFullyPaid)}
                                                            disabled={savingFullyPaid}
                                                    >Save Invoice Data</Button>
                                                    {savingFullyPaid ? (
                                                        <Spinner id={"fullyPaidSpinner"} color={"default"} />) : null}
                                                    <div id={"successSaveMsgFullyPaid"}
                                                         className={"opacity-0 transition-opacity ease-out text-center rounded-md p-1 bg-green-300  text-green-700 dark:bg-green-950 dark:border-1 dark:border-green-500 dark:text-green-200"}>
                                                        <span className={"text-sm"}>Save success!</span>
                                                    </div>
                                                    {failedToSaveInvoices.length > 0 ? (
                                                            <WarningMessage/>
                                                    ): null}

                                                </div>
                                            </div>
                                        ) :
                                        <div>
                                            <p>No fully-paid Invoices found</p>
                                        </div>}
                                </AccordionItem>
                                <AccordionItem key="2" aria-label="Accordion 3" title={titleInfo("Over Paid Invoices")}>
                                    {viewOverPaidInvoices.length > 0 ? (
                                            <div className={"flex space-x-5"}>
                                                <DisplayInvoiceList invoiceList={viewOverPaidInvoices} />
                                                <div
                                                    className={"flex flex-col space-y-2 border-l-small px-3 py-3 dark:border-default-100"}>
                                                    <span
                                                        className={"text-sm"}>Invoice Count: {viewOverPaidInvoices.length}</span>
                                                    <Button radius={"sm"}
                                                            onPress={() => saveInvoiceData("successSaveMsgOverPaid", "warningSaveMsgOverPaid", overPaidInvoices, setSavingOverPaid)}>Save
                                                        Invoice Data
                                                    </Button>
                                                    {savingOverPaid ? (
                                                        <Spinner id={"overPaidSpinner"} color={"default"} />) : null}
                                                    <div id={"successSaveMsgOverPaid"}
                                                         className={"opacity-0 transition-opacity ease-out text-center rounded-md p-1 bg-green-300  text-green-700 dark:bg-green-950 dark:border-1 dark:border-green-500 dark:text-green-200"}>
                                                        <span className={"text-sm"}>Save success!</span>
                                                    </div>
                                                    <div id={"warningSaveMsgOverPaid"}
                                                         className={" opacity-0 transition-opacity ease-out text-center rounded-md p-1 bg-yellow-300  text-yellow-700 dark:bg-yellow-950 dark:border-1 dark:border-yellow-500 dark:text-yellow-200"}>
                                                        <span className={"text-sm font-bold"}>Warning</span>
                                                        <br />
                                                        <span className={"text-sm"}>Some invoices failed to save</span>
                                                        {failedToSaveInvoices.length > 0 ? (
                                                            <>
                                                                {failedToSaveInvoices.map(invoiceID=>(
                                                                    <div>invoiceID</div>
                                                                ))}
                                                            </>):null}
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                        <div>
                                            <p>No Over-paid Invoices found</p>
                                        </div>}
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Accordion 2"
                                               title={titleInfo("Short Paid Invoices")}>
                                    {viewShortPaidInvoices.length > 0 ? (
                                            <div className={"flex space-x-5"}>
                                                <DisplayInvoiceList invoiceList={viewShortPaidInvoices} />
                                            <div
                                                className={"flex flex-col space-y-2 border-l-small px-3 py-3 dark:border-default-100"}>
                                                <span
                                                    className={'text-sm'}>Invoice Count: {viewShortPaidInvoices.length}</span>
                                                <Popover color={'danger'} radius={'sm'} placement={'top-end'}>
                                                    <PopoverTrigger>
                                                        <Button radius={'sm'} disabled={true}>Save Invoice Data</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <div className="px-1 py-2">
                                                            <div className="text-small font-bold">Not Permitted</div>
                                                            <div className="text-tiny">Invoices that are not fully paid cannot be saved.</div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>

                                            </div>
                                        </div>
                                    ) :
                                    <div>
                                        <p>No Short-paid Invoices found</p>
                                    </div>}
                                </AccordionItem>
                            </Accordion>
                        </> : null
                }
            </div>
        </>

    );
};
export default ViewFilteredInvoices;