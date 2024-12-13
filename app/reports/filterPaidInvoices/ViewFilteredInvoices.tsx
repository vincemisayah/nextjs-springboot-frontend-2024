import { Accordion, Card, Skeleton } from "@nextui-org/react";
import { File } from "node:buffer";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import LoadingFilteredInvoicesSkeleton from "@/app/reports/filterPaidInvoices/LoadingFilteredInvoicesSkeleton";
import { AccordionItem } from "@nextui-org/accordion";
import DisplayInvoiceList from "@/app/reports/filterPaidInvoices/DisplayInvoiceList";
import { FaFileInvoiceDollar } from "react-icons/fa";


interface ViewFilteredInvoicesProps {
    selectedFile?: File | any;
}

const ViewFilteredInvoices = ({ selectedFile }: ViewFilteredInvoicesProps) => {
    const [loggedIn, setLoggedIn] = useState(3667);
    const [isFetching, setIsFetching] = useState(false);
    const [shortPaidInvoices, setShortPaidInvoices] = useState([]);
    const [fullyPaidInvoices, setFullyPaidInvoices] = useState([]);
    const [overPaidInvoices, setOverPaidInvoices] = useState([]);

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
                    // Do something with the extracted data
                    console.log(data);
                    setShortPaidInvoices(data.ShortPaidInvoices);
                    setFullyPaidInvoices(data.FullyPaidInvoices);
                    setOverPaidInvoices(data.OverPaidInvoices);
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

    return (
        <>
            <div className={'flex flex-col gap-4'}>
                <div>
                    <Button  onPress={() => { postData() }}
                             radius={'sm'}>
                        Filter Paid Invoices
                    </Button>
                </div>

                {isFetching ? <LoadingFilteredInvoicesSkeleton /> :
                    (fullyPaidInvoices.length > 0) ?
                        <>
                            <Accordion selectionMode="multiple">
                                <AccordionItem key="1" aria-label="Accordion 1" title={titleInfo('Fully Paid Invoices')}>
                                    <div className={'flex space-x-5'}>
                                        <DisplayInvoiceList invoiceList={fullyPaidInvoices} />
                                        <div className={'h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100'}>
                                            <span className={'text-sm'}>Invoice Count: {fullyPaidInvoices.length}</span>
                                            <Button radius={'sm'}>Save Invoice Data</Button>
                                        </div>
                                    </div>

                                </AccordionItem>
                                <AccordionItem key="2" aria-label="Accordion 2"
                                               title={titleInfo('Short Paid Invoices')}>
                                    <div className={'flex space-x-5'}>
                                        <DisplayInvoiceList invoiceList={shortPaidInvoices} />
                                        <div
                                            className={'h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100'}>
                                            <span className={'text-sm'}>Invoice Count: {shortPaidInvoices.length}</span>
                                            <Button radius={'sm'}>Save Invoice Data</Button>
                                        </div>
                                    </div>
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Accordion 3" title={titleInfo('Over Paid Invoices')}>
                                    <div className={'flex space-x-5'}>
                                        <DisplayInvoiceList invoiceList={overPaidInvoices} />
                                        <div
                                            className={'h-fit flex flex-col space-y-2 border-small px-3 py-3 rounded-small border-default-200 dark:border-default-100'}>
                                            <span className={'text-sm'}>Invoice Count: {overPaidInvoices.length}</span>
                                            <Button radius={'sm'}>Save Invoice Data</Button>
                                        </div>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </> : null
                }
            </div>
        </>

    );
};
export default ViewFilteredInvoices;