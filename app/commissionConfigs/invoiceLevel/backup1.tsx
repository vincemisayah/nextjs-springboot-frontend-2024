import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoice = (props: { invoiceNumber: number }) =>{
    const [currentInvoiceId, setCurrentInvoiceId] = useState(props.invoiceNumber);
    const [chargedItems, setChargedItems] = useState<Object>([]);

    const { data: invoiceChargedItems, error: invoiceChargedItemsError } = useSWR(props.invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/invoiceChargedTaskItems?invoiceId=" + props.invoiceNumber:null,
        fetcher
    );

    console.log('invoiceChargedItems', invoiceChargedItems);

    return(
        <div className={'rounded-small border-small border-default-200 dark:border-default-100'}>
            <div className={'min-w-[50vw] p-4 m-3 rounded-small border-small border-default-200 dark:border-default-100'}>
                <h1>Display Invoice for Invoice ID</h1>
                <span>{props.invoiceNumber}</span>
            </div>

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
                            <TableRow key={invoiceChargedItem.order}>
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