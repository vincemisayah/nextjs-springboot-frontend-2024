import { Tabs, Tab, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";
import DisplayArrayOfObjectsAsTable from "@/components/DisplayArrayOfObjectsAsTable";
import { FaRegFilePdf } from "react-icons/fa";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";

const DisplayFetchedInvoices = ({PaidInvoice, SalespersonAssignedInvoices}:any) =>{
    const viewPdfButtonRef = useRef<HTMLButtonElement>(null);

    const [isFetching, setIsFetching] = React.useState(false);

    function openResponseInNewTab(response: Response) {
        // Convert response to Blob
        response.blob().then((blob: Blob | MediaSource) => {
            // Create a URL object from the Blob
            const url = URL.createObjectURL(blob);

            // Open the URL in a new tab
            window.open(url, '_blank');
        });
    }

    const viewPdfCommissionReport = async (empID:number, invoiceIDs: string | any[] | Blob) =>{
        const invoiceIdArray: string | any[] | Blob = [];

        // @ts-ignore
        invoiceIDs.forEach((invoiceId: { InvoiceID: any; }) => {
            invoiceIdArray.push(invoiceId.InvoiceID);
        })

        let data = new FormData();
        // @ts-ignore
        data.append('invoiceList', invoiceIdArray);

        setIsFetching(true);
        if(viewPdfButtonRef.current !== null)
            viewPdfButtonRef.current.disabled = true;
        await fetch('http://localhost:1118/invoiceCommissionService/report/v1/viewSalespersonPdfReport/' + empID,{
            method: 'POST',
            body: data,
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if(viewPdfButtonRef !== null){ // @ts-ignore
                viewPdfButtonRef.current.disabled = false;
            }
            setIsFetching(false);
            // console.log('calculatingSpan.current = ', calculatingSpan.current);
            openResponseInNewTab(response);
        })
            .then(data => {

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <>
            {PaidInvoice.length > 0 && SalespersonAssignedInvoices.length > 0?(
                <div
                    className='flex flex-col gap-5 border-t-small border-b-small p-3 border-default-200 dark:border-default-100'>
                    <div>
                        <span className={'font-bold'}>Fetched Invoices</span>
                        <p className={'mt-1'}>
                            Select the salesperson's name to view their assigned invoices.
                            Click "Generate PDF Report" to view the salesperson's downloadable PDF Commission Report.
                        </p>
                    </div>
                    <div className="flex w-full flex-col">
                        <Tabs aria-label="Options" radius={'sm'} variant={'solid'}>
                            <Tab key="photos" title={"All Invoices"}>
                                <DisplayArrayOfObjectsAsTable list={PaidInvoice} />
                            </Tab>

                            {SalespersonAssignedInvoices.map((obj:any, index:any)=>
                                (<Tab key={index} title={obj.salesperson.firstLastName}>
                                    <button ref={viewPdfButtonRef} onClick={()=>viewPdfCommissionReport(obj.salesperson.empID, obj.assignedInvoices)}
                                        className={"text-sm border-1 py-1 px-3 rounded-md bg-[#d6e8fd] text-[#4069af] border-[#3f84c7] " +
                                        "dark:bg-[#27272a] dark:border-[#818188] dark:text-[#818188]"}>
                                        {!isFetching?(
                                            <div className={"flex items-center space-x-2"}>
                                                <FaRegFilePdf />
                                                <span>Generate PDF Report</span>
                                            </div>
                                        ):(
                                            <div className={"flex items-center space-x-2"}>
                                                <Spinner size="sm" color={'primary'}/>
                                                <span>Calculating Salesperson Commission . . . </span>
                                            </div>
                                        )}

                                    </button>
                                    <Spacer y={3} />
                                        <Card radius={'sm'} shadow={'sm'}>
                                            <CardBody>
                                                <DisplayArrayOfObjectsAsTable list={obj.assignedInvoices} />
                                            </CardBody>
                                        </Card>
                                </Tab>))}
                        </Tabs>
                    </div>
                </div>
            ):null}
        </>
    );
}
export default DisplayFetchedInvoices;