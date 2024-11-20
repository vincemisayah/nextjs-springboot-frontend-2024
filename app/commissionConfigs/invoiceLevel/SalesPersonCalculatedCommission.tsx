import useSWR from "swr";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const SalesPersonCalculatedCommission = ({customerID, invoiceID, taskID, orderNumber, employeeID}) =>{
    const { data: calculatedCommissionInfo, error: calculatedCommissionInfoError } = useSWR(invoiceID > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/calculatedInvoiceTaskCommission?" +
            "customerID=" + customerID +
            "&invoiceID=" + invoiceID +
            "&taskID=" + taskID +
            "&orderNumber=" + orderNumber +
            "&employeeID=" + employeeID : null,
        fetcher
    );

    console.log('SalesPersonCalculatedCommission calculatedCommissionInfo = ', calculatedCommissionInfo);
    if(calculatedCommissionInfoError){
        return(
            <>
                Error - failed to load data.
            </>
        )
    }

    return(
        <>
            {calculatedCommissionInfo ? (
                <Table aria-label="Example static collection table" removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn className={'dark:bg-[#222222]'}>Amount</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Rate</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Commission Value</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Salesperson Assigned Rate</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Sales Commission</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            className={'border-b-small hover:bg-gray-50 dark:hover:bg-[#4f4f4f] hover:cursor-pointer transition-background ease-linear delay-75'}>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.amount}</TableCell>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.taskRate}</TableCell>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.taskCommissionDollarValue}</TableCell>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.salesPersonAssignedRate}</TableCell>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.salesDollarValue}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ):<Spinner color={'default'} label={'Loading...'} />}
        </>
    );
}
export default SalesPersonCalculatedCommission;