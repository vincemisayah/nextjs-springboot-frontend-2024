import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
    Accordion,
    Divider,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
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

//  `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/searchInvoiceById?searchInput=${searchInput}`:null,
    const { data: invoiceChargedItems, error: invoiceChargedItemsError } = useSWR(props.invoiceNumber > 0?
        `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/invoiceChargedTaskItems?invoiceId=${props.invoiceNumber}`:null,
        fetcher
    );

    // http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=208072
    const { data: customerJobInfo, error: customerJobInfoError } = useSWR(props.invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/customerAndJobInfo?invoiceId=${props.invoiceNumber}`:null,
        fetcher
    );

    const { data: customerInfoWithSalesEmployeeList, error: customerInfoWithSalesEmployeeListError } = useSWR(props.invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/customerInfo?invoiceId=${props.invoiceNumber}`:null,
        fetcher
    );

    // http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceDistinctTaskItems?invoiceID=208072
    const { data: distinctInvoiceTaskItems, error: distinctInvoiceTaskItemsError } = useSWR(props.invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/invoiceDistinctTaskItems?invoiceId=${props.invoiceNumber}`:null,
        fetcher
    );

    const openModal = (taskId: React.SetStateAction<number>, order: React.SetStateAction<number>) => {
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

        const displayInvoiceContainer = document.getElementById('displayInvoiceContainer');
        // @ts-ignore
        displayInvoiceContainer.hidden = true;
    }

    return(
        <div id={'mainConfigContent'}
             className={'rounded-small border-small border-default-200 dark:border-default-100 bg-[#f4f4f5] dark:bg-[#222222]'}>

            <div id={'changeInvoiceBtn'} hidden={false} className={'px-4 pt-1.5 text-end'}>
                <button
                    onClick={expandInvoiceSelector}
                    className={'border-small px-3 py-1 mt-1.5 rounded-small ' +
                        'border-default-200 dark:border-default-100 ' +
                        'bg-white dark:bg-[#414147] shadow-sm text-gray-500 ' +
                        'text-md hover:bg-[#e7e7e9] active:bg-[#dadadd] ' +
                        'dark:text-gray-300 dark:hover:bg-[#3c3c3c] transition ease-in-out duration-100'}
                >
                    Select different invoice
                </button>
            </div>

            <div
                className={"min-w-[50vw] p-4 m-3 rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c] bg-white"}>
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
            <div className={"bg-[#f4f4f5] dark:bg-[#222222]"}>
                {(customerJobInfo !== undefined) ? (
                    <ShowDistinctInvoiceTaskItems
                        customerId={customerJobInfo.customerID}
                        invoiceNumber={props.invoiceNumber}
                        distinctInvoiceTaskItems={distinctInvoiceTaskItems}
                    />
                ) : null}


            </div>
            <div
                className={"p-1.5 m-3 rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c] bg-white"}>
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