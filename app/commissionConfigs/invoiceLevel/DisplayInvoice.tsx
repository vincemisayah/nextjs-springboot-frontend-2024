import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Accordion, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AccordionItem } from "@nextui-org/accordion";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import ModalSalesCommission from "@/app/commissionConfigs/invoiceLevel/ModalSalesCommission";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoice = (props: { invoiceNumber: number }) =>{
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState(-1);

    const { data: invoiceChargedItems, error: invoiceChargedItemsError } = useSWR(props.invoiceNumber > 0?
        "http://localhost:1118/invoiceCommissionService/customerlevel/invoiceChargedTaskItems?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    // http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=208072
    const { data: customerJobInfo, error: customerJobInfoError } = useSWR(props.invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    // console.log('customerJobInfo', customerJobInfo);

    const openModal = (order: React.SetStateAction<number>) => {
        setSelectedOrder(order);
        onOpen();
    }


    return(
        <div className={'rounded-small border-small border-default-200 dark:border-default-100'}>
            <div
                className={"min-w-[50vw] p-4 m-3 rounded-small border-small border-default-200 dark:border-default-100"}>
                <h1>Display Invoice for Invoice ID</h1>
                <ul className={'mt-1'}>
                    <li className={"ml-5 text-[9pt]"}>
                        <strong>CUSTOMER NAME: </strong>{customerJobInfo.customerName}
                        <span className={"ml-1 text-[#71717a]"}>(AR#: {customerJobInfo.arNumber})</span>
                    </li>
                    <li className={"ml-5 text-[9pt]"}>
                        <strong>JOB INFO: </strong>{customerJobInfo.jobName}
                        <span className={"ml-1 text-[#71717a]"}>(JOB#: {customerJobInfo.jobID}))</span>
                    </li>
                    <li className={"ml-5 text-[9pt]"}>
                        <strong>INVOICE ID: </strong>{customerJobInfo.invoiceID}</li>
                </ul>
                {/*<span>{props.invoiceNumber}</span>*/}
                <ModalSalesCommission invoiceId={props.invoiceNumber}
                                      customerJobInfo={customerJobInfo}
                                      order={selectedOrder}
                                      isOpen={isOpen}
                                      onOpen={onOpen}
                                      onOpenChange={onOpenChange}
                />
            </div>

            {/*<div className={'p-1.5 m-3'}>*/}
            {/*    <Accordion isCompact={true} selectionMode={'multiple'}>*/}
            {/*        /!*@ts-ignore*!/*/}
            {/*        {invoiceChargedItems?.map((invoiceChargedItem) => (*/}
            {/*            <AccordionItem key={invoiceChargedItem.order} title={*/}
            {/*                <>*/}
            {/*                    <Table aria-label="Example static collection table" removeWrapper={true} isCompact>*/}
            {/*                        <TableHeader>*/}
            {/*                            <TableColumn>Task</TableColumn>*/}
            {/*                            <TableColumn>Description</TableColumn>*/}
            {/*                            <TableColumn>Qty</TableColumn>*/}
            {/*                            <TableColumn>Cost</TableColumn>*/}
            {/*                            <TableColumn>Amount</TableColumn>*/}
            {/*                        </TableHeader>*/}
            {/*                        <TableBody>*/}
            {/*                            <TableRow key={invoiceChargedItem.order}>*/}
            {/*                                <TableCell>{invoiceChargedItem.taskName}</TableCell>*/}
            {/*                                <TableCell>{invoiceChargedItem.description}</TableCell>*/}
            {/*                                <TableCell>{invoiceChargedItem.qty}</TableCell>*/}
            {/*                                <TableCell>{invoiceChargedItem.cost}</TableCell>*/}
            {/*                                <TableCell>{invoiceChargedItem.amount}</TableCell>*/}
            {/*                            </TableRow>*/}
            {/*                        </TableBody>*/}
            {/*                    </Table>*/}
            {/*                </>*/}
            {/*            }>*/}

            {/*                <div className="flex w-full flex-col">*/}
            {/*                    <Tabs aria-label="Options">*/}
            {/*                        <Tab key="photos" title="Photos">*/}
            {/*                            <Card>*/}
            {/*                                <CardBody>*/}
            {/*                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod*/}
            {/*                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim*/}
            {/*                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea*/}
            {/*                                    commodo consequat.*/}
            {/*                                </CardBody>*/}
            {/*                            </Card>*/}
            {/*                        </Tab>*/}
            {/*                        <Tab key="music" title="Music">*/}
            {/*                            <Card>*/}
            {/*                                <CardBody>*/}
            {/*                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi*/}
            {/*                                    ut aliquip ex ea commodo consequat. Duis aute irure dolor in*/}
            {/*                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla*/}
            {/*                                    pariatur.*/}
            {/*                                </CardBody>*/}
            {/*                            </Card>*/}
            {/*                        </Tab>*/}
            {/*                        <Tab key="videos" title="Videos">*/}
            {/*                            <Card>*/}
            {/*                                <CardBody>*/}
            {/*                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui*/}
            {/*                                    officia deserunt mollit anim id est laborum.*/}
            {/*                                </CardBody>*/}
            {/*                            </Card>*/}
            {/*                        </Tab>*/}
            {/*                    </Tabs>*/}
            {/*                </div>*/}

            {/*            </AccordionItem>*/}

            {/*        ))}*/}
            {/*    </Accordion>*/}
            {/*</div>*/}

            <div className={'p-1.5 m-3 rounded-small border-small border-default-200 dark:border-default-100'}>
                <Table aria-label="Example static collection table" removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn>Task</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Qty</TableColumn>
                        <TableColumn>Cost</TableColumn>
                        <TableColumn>Amount</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {/*@ts-ignore*/}
                        {invoiceChargedItems?.map((invoiceChargedItem) => (
                            <TableRow key={invoiceChargedItem.order}
                                      onClick={()=>openModal(invoiceChargedItem.order)}
                                      className={'border-b-small hover:bg-gray-50 dark:hover:bg-cyan-900 hover:cursor-pointer'}>
                                <TableCell>{invoiceChargedItem.taskName}</TableCell>
                                <TableCell>{invoiceChargedItem.description}</TableCell>
                                <TableCell>{invoiceChargedItem.qty}</TableCell>
                                <TableCell>{invoiceChargedItem.cost} Customer</TableCell>
                                <TableCell>{invoiceChargedItem.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


        </div>


    )
}
export default DisplayInvoice;