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

    const postData = async ( ) =>{
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

    const saveInvoiceData = async (invoiceData:any, setIsSaving: ((arg0: boolean) => void) | undefined) =>{
        console.log("saveInvoiceData = ", invoiceData);

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
            return response.json(); // Assuming the response is JSON
        })
            .then(data => {
                if (setIsSaving) {
                    setIsSaving(false);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <>
            <div className={'flex flex-col gap-4'}>
                <div>
                    <Button  onPress={() => {postData( )}}
                             radius={'sm'}>
                        <LuFilter />
                        <span>Filter Paid Invoices</span>
                    </Button>
                </div>

                {isFetching ? <LoadingFilteredInvoicesSkeleton /> :
                    (fullyPaidInvoices.length > 0) ?
                        <>
                            {duplicateInvoices.length > 0 ?(
                                <div className={'w-fit flex flex-row border-small items-center p-2 rounded-small border-default-200 dark:border-default-100'}>
                                    <div className={"w-80 flex flex-row h-fit"}>
                                        <span className={"text-[10pt] justify-start p-1"}>
                                            Your file contained {duplicateInvoices.length} duplicated invoice IDs.
                                            <br />
                                            <Spacer y={1} />
                                            The duplicates of the listed invoices (shown right) are removed after the filtering process.
                                        </span>
                                    </div>
                                    <div className={'pl-3 border-l-small border-default-200 dark:border-default-100'}>
                                        <DisplayArrayOfObjectsAsTable list={duplicateInvoices} />
                                    </div>

                                </div>
                            ) : null}

                            <Accordion selectionMode="multiple">
                                <AccordionItem key="1" aria-label="Accordion 1" title={titleInfo("Fully Paid Invoices")}>
                                    {viewFullyPaidInvoices.length > 0 ? (
                                            <div className={"flex space-x-5"}>
                                                <DisplayInvoiceList invoiceList={viewFullyPaidInvoices} />
                                                <div
                                                    className={"h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100"}>
                                                    <span
                                                        className={"text-sm"}>Invoice Count: {viewFullyPaidInvoices.length}</span>
                                                    <Button radius={"sm"}
                                                            onClick={( )=>saveInvoiceData(fullyPaidInvoices, setSavingFullyPaid)}
                                                            disabled={savingFullyPaid}
                                                    >Save Invoice Data</Button>
                                                    {savingFullyPaid?(<Spinner id={'fullyPaidSpinner'}/>):null}
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
                                                    className={"h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100"}>
                                                <span
                                                    className={"text-sm"}>Invoice Count: {viewOverPaidInvoices.length}</span>
                                                    <Button radius={"sm"} onPress={( )=>saveInvoiceData(overPaidInvoices, setSavingOverPaid)}>Save Invoice Data</Button>
                                                    {savingOverPaid?(<Spinner id={'overPaidSpinner'}/>):null}
                                                </div>
                                            </div>
                                        ) :
                                        <div>
                                            <p>No Over-paid Invoices found</p>
                                        </div>}
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Accordion 2"
                                               title={titleInfo("Short Paid Invoices")}>
                                {viewShortPaidInvoices.length > 0? (
                                        <div className={"flex space-x-5"}>
                                            <DisplayInvoiceList invoiceList={viewShortPaidInvoices} />
                                            <div
                                                className={"h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100"}>
                                                <span
                                                    className={'text-sm'}>Invoice Count: {viewShortPaidInvoices.length}</span>
                                                <Popover color={'danger'} radius={'sm'} placement={'top-end'}>
                                                    <PopoverTrigger>
                                                        <Button radius={'sm'} onPress={( )=>saveInvoiceData(shortPaidInvoices, setSavingShortPaid)} disabled={true}>Save Invoice Data</Button>
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