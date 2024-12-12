import { Accordion, Card, Skeleton } from "@nextui-org/react";
import { File } from "node:buffer";
import useSWR from "swr";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import LoadingFilteredInvoicesSkeleton from "@/app/reports/filterPaidInvoices/LoadingFilteredInvoicesSkeleton";
import { AccordionItem } from "@nextui-org/accordion";


interface ViewFilteredInvoicesProps {
    selectedFile?: File | null;
}

const ViewFilteredInvoices = ({ selectedFile }: ViewFilteredInvoicesProps) => {
    const [loggedIn, setLoggedIn] = useState(3667);
    const [isFetching, setIsFetching] = useState(false);
    const [fullyPaidInvoices, setFullyPaidInvoices] = useState([]);

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
                    setFullyPaidInvoices(data.FullyPaidInvoices);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
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

                {/*{isFetching ? <LoadingFilteredInvoicesSkeleton /> :*/}
                {/*    (fullyPaidInvoices.length > 0) ? fullyPaidInvoices[0].uploadedBy : null*/}
                {/*}*/}

                {/*{isFetching ? <LoadingFilteredInvoicesSkeleton /> :*/}
                {/*    (fullyPaidInvoices.length > 0) ?*/}
                {/*        fullyPaidInvoices.map((item, index)=>(*/}
                {/*            <div>{item.invoiceID}</div>*/}
                {/*        ))*/}
                {/*        : null*/}
                {/*}*/}

                {isFetching ? <LoadingFilteredInvoicesSkeleton /> :
                    (fullyPaidInvoices.length > 0) ?
                        <>
                            <Accordion selectionMode="multiple">
                                <AccordionItem key="1" aria-label="Accordion 1" title="Fully Paid Invoices">
                                    A
                                </AccordionItem>
                                <AccordionItem key="2" aria-label="Accordion 2" title="Short Paid Invoices">
                                    B
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="Accordion 3" title="Over Paid Invoices">
                                    C
                                </AccordionItem>
                            </Accordion>
                        </>
                        : null
                }

            </div>



        </>

    );
};
export default ViewFilteredInvoices;