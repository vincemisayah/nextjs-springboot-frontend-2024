import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Accordion, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AccordionItem } from "@nextui-org/accordion";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import ModalSalesCommission from "@/app/commissionConfigs/invoiceLevel/ModalSalesCommission";
import { FaGear } from "react-icons/fa6";

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


    return(
        <div
            className={'rounded-small border-small border-default-200 dark:border-default-100 bg-[#ffffff] dark:bg-[#222222]'}>
            <div
                className={"min-w-[50vw] p-4 m-3 rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c]"}>
                <h1>Display Invoice for Invoice ID</h1>
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
            <div
                className={"rounded-small dark:border-default-100 bg-[#ffffff] dark:bg-[#222222]"}>
                <div
                    className={"min-w-[50vw] p-4 m-3 shadow-md rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c]"}>
                    <div className="space-y-1 mb-5">
                        <h4 className="text-medium font-medium">Configurable Invoice Task Items for Invoice ID: {props.invoiceNumber}</h4>
                        <p className="text-small text-default-400">
                            Edit the task items associated commission rates.
                        </p>
                    </div>
                    <table className={"min-w-full divide-y divide-gray-200 dark:divide-neutral-700"}>
                        <thead>
                        <tr>
                            <th scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Task Name
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Description
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Customer-level Task Rate
                            </th>
                            <th scope="col"
                                className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action
                            </th>
                        </tr>
                        </thead>
                        <tbody className={"divide-y divide-gray-200 dark:divide-neutral-700"}>
                        {distinctInvoiceTaskItems?.map((taskItem: { taskID: React.Key | null | undefined; }) => (
                            <tr key={taskItem.taskID}
                                className={"border-b-small border-t-small"}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{taskItem.taskName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{taskItem.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    <input type={"number"}
                                           className={"max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded"} />
                                </td>

                                {/*<div className="max-w-md">*/}
                                {/*    <div className="flex mt-2 mb-5 h-5 items-center space-x-4 text-small">*/}
                                {/*        <div className={'flex'}>*/}
                                {/*            <FaGear className={'mr-1 mt-0.5'}/>*/}
                                {/*            {taskItem.taskName}*/}
                                {/*        </div>*/}
                                {/*        <Divider orientation="vertical" />*/}
                                {/*        <div>{taskItem.description}</div>*/}
                                {/*        <Divider orientation="vertical" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>


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