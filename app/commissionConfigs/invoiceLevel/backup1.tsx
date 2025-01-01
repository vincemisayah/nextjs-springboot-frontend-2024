import useSWR from "swr";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";
import { PiPercentLight } from "react-icons/pi";

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

    if(calculatedCommissionInfoError){
        return(
            <>
                Error - failed to load data.
            </>
        )
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return(
        <>
            {calculatedCommissionInfo ? (
                <Table removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn className={'dark:bg-[#222222]'}>Amount</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Commission Value</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Assigned Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Sales Commission</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            className={'border-b-small'}>
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>
                                {formatter.format(calculatedCommissionInfo.amount)}
                            </TableCell>
                            {/*<TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>{calculatedCommissionInfo.taskRate}</TableCell>*/}
                            <TableCell className={'text-[9pt] dark:text-[#dedfe1]'}>
                                <div className={"flex"}>
                                    <input type={"number"}
                                           defaultValue={calculatedCommissionInfo.taskRate}
                                           className={"remove-arrow border-1 text-center w-full sm:w-16 rounded"}
                                    />
                                    <PiPercentLight className={"ml-1"} size={15} />
                                </div>
                            </TableCell>
                            <TableCell className={"text-[9pt] dark:text-[#dedfe1]"}>
                                {formatter.format(calculatedCommissionInfo.taskCommissionDollarValue)}
                            </TableCell>
                            <TableCell className={"text-[9pt] dark:text-[#dedfe1]"}>
                                <div className={"flex"}>
                                    <input type={"number"}
                                           defaultValue={calculatedCommissionInfo.salesPersonAssignedRate}
                                           className={"remove-arrow border-1 text-center w-full sm:w-16 rounded"}
                                    />
                                    <PiPercentLight className={"ml-1"} size={15} />
                                </div>
                            </TableCell>
                            <TableCell className={"text-[9pt] dark:text-[#dedfe1]"}>
                                {formatter.format(calculatedCommissionInfo.salesDollarValue)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : <Spinner color={'default'} label={'Loading...'} />}
        </>
    );
}
export default SalesPersonCalculatedCommission;