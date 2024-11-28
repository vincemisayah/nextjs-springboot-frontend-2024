import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Accordion, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AccordionItem } from "@nextui-org/accordion";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import ModalSalesCommission from "@/app/commissionConfigs/invoiceLevel/ModalSalesCommission";
import { FaGear } from "react-icons/fa6";
import ShowDistinctInvoiceTaskItems from "@/app/commissionConfigs/invoiceLevel/ShowDistinctInvoiceTaskItems";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoice = (props: { invoiceNumber: number }) =>{
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState(-1);
    const [selectedTaskId, setSelectedTaskId] = useState(-1);
    const [customerInfo, setCustomerInfo] = useState([]);

    const { data: invoiceChargedItems, error: invoiceChargedItemsError } = useSWR(props.invoiceNumber > 0?
        "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceChargedTaskItems?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    // http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=208072
    const { data: customerJobInfo, error: customerJobInfoError } = useSWR(props.invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    const { data: customerInfoWithSalesEmployeeList, error: customerInfoWithSalesEmployeeListError } = useSWR(props.invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerInfo?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    // http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceDistinctTaskItems?invoiceID=208072
    const { data: distinctInvoiceTaskItems, error: distinctInvoiceTaskItemsError } = useSWR(props.invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceDistinctTaskItems?invoiceID=" + props.invoiceNumber:null,
        fetcher
    );

    const openModal = (taskId: React.SetStateAction<number>, order: React.SetStateAction<number>) => {
        console.log("openModal = ",customerInfoWithSalesEmployeeList.salesPersonList);
        console.log('taskId = ', taskId)
        setSelectedOrder(order);
        setSelectedTaskId(taskId);
        // salesPersonList
        setCustomerInfo(customerInfoWithSalesEmployeeList);
        onOpen( );
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    const expandInvoiceSelector = ( ) => {
        const searchInvoiceContainer = document.getElementById('searchInvoiceContainer');
        // @ts-ignore
        searchInvoiceContainer.hidden = false;

        const changeInvoiceBtn = document.getElementById('changeInvoiceBtn');
        // @ts-ignore
        changeInvoiceBtn.hidden = true;
    }

    return(
        <div id={'mainConfigContent'}
            className={'rounded-small border-small border-default-200 dark:border-default-100 bg-[#ffffff] dark:bg-[#222222]'}>
            <div
                className={"min-w-[50vw] p-4 m-3 rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c]"}>
                <h1>Customer and Job Details</h1>
                {(customerJobInfo !== undefined) ? (
                    <>
                        <ul className={'mt-1'}>
                            <li className={"ml-5 text-[9pt] dark:text-[#dedfe1]"}>
                                <strong>CUSTOMER NAME: </strong>{customerJobInfo.customerName}
                                <span
                                    className={"ml-1 text-[9pt] dark:text-[#dedfe1]"}>(AR#: {customerJobInfo.arNumber})</span>
                            </li>
                            <li className={"ml-5 text-[9pt] dark:text-[#dedfe1]"}>
                                <strong>JOB INFO: </strong>{customerJobInfo.jobName}
                                <span
                                    className={"ml-1 text-[9pt] dark:text-[#dedfe1]"}>(JOB#: {customerJobInfo.jobID}))</span>
                            </li>
                            <li className={"ml-5 text-[9pt] dark:text-[#dedfe1]"}>
                                <strong>INVOICE ID: </strong>{customerJobInfo.invoiceID}</li>
                        </ul>
                    </>
                ) : null}
                <div  id={'changeInvoiceBtn'} hidden={true}>
                    <Button
                        onPress={expandInvoiceSelector}
                        className={'mt-2'} size={'sm'}>
                        Select different invoice
                    </Button>
                </div>

                <ModalSalesCommission invoiceId={props.invoiceNumber}
                                      customerJobInfo={customerJobInfo}
                                      taskId={selectedTaskId}
                                      order={selectedOrder}
                                      isOpen={isOpen}
                                      onOpen={onOpen}
                                      onOpenChange={onOpenChange}
                                      customerInfo={customerInfo}
                />
            </div>
            <div className={"rounded-small dark:border-default-100 bg-[#ffffff] dark:bg-[#222222]"}>
                {(customerJobInfo !== undefined) ? (
                    <ShowDistinctInvoiceTaskItems customerId={customerJobInfo.customerID}  invoiceNumber={props.invoiceNumber} distinctInvoiceTaskItems={distinctInvoiceTaskItems}/>
                ): null}

            </div>
            <div
                className={"p-1.5 m-3 rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c]"}>
                <Table aria-label="Example static collection table" removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn className={"dark:bg-[#222222]"}>Task</TableColumn>
                        <TableColumn className={"dark:bg-[#222222]"}>Description</TableColumn>
                        <TableColumn className={"dark:bg-[#222222]"}>Qty</TableColumn>
                        <TableColumn className={"dark:bg-[#222222]"}>Cost</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Amount</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {/*@ts-ignore*/}
                        {invoiceChargedItems?.map((invoiceChargedItem) => (
                            <TableRow key={invoiceChargedItem.order}
                                      onClick={() => openModal(invoiceChargedItem.taskId, invoiceChargedItem.order)}
                                      className={'border-b-small hover:bg-gray-50 dark:hover:bg-[#4f4f4f] hover:cursor-pointer transition-background ease-linear delay-75'}>
                                <TableCell
                                    className={'text-[9pt] dark:text-[#dedfe1]'}>{invoiceChargedItem.taskName}</TableCell>
                                <TableCell
                                    className={'text-[9pt] dark:text-[#dedfe1]'}>{invoiceChargedItem.description}</TableCell>
                                <TableCell
                                    className={'text-[9pt] dark:text-[#dedfe1]'}>{invoiceChargedItem.qty}</TableCell>
                                <TableCell
                                    className={'text-[9pt] dark:text-[#dedfe1]'}>{formatter.format(invoiceChargedItem.cost)}</TableCell>
                                <TableCell
                                    className={'text-[9pt] dark:text-[#dedfe1]'}>{formatter.format(invoiceChargedItem.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


        </div>


    )
}
export default DisplayInvoice;