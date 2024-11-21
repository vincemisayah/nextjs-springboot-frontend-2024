import useSWR from "swr";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import { PiPercentLight } from "react-icons/pi";
import { DeleteIcon, EditIcon, EyeIcon } from "@nextui-org/shared-icons";
import { RxReset } from "react-icons/rx";
import { FaRegMessage } from "react-icons/fa6";
import clsx from "clsx";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());


// @ts-ignore
const SalesPersonCalculatedCommission = ({customerID, invoiceID, taskID, orderNumber, employeeID}) =>{
    useEffect(() => {
        const table = document.getElementById("tableId#" + employeeID);
        // @ts-ignore
        table.style.opacity = "1";
    }, [employeeID]);

    const { data: calculatedCommissionInfo, error: calculatedCommissionInfoError } = useSWR(invoiceID > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/calculatedInvoiceTaskCommission?" +
            "customerID=" + customerID +
            "&invoiceID=" + invoiceID +
            "&taskID=" + taskID +
            "&orderNumber=" + orderNumber +
            "&employeeID=" + employeeID : null,
        fetcher
    );

    // console.log('SalesPersonCalculatedCommission calculatedCommissionInfo = ', calculatedCommissionInfo);
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
        <div id={'tableId#' + employeeID} className={'opacity-0 transition-opacity ease-linear delay-150'}>
            {calculatedCommissionInfo != undefined ? (
                <Table
                    removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn className={'dark:bg-[#222222]'}>Amount</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Commission Value</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Assigned Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Sales Commission</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Actions</TableColumn>
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
                                    <FaRegMessage
                                        // color={clsx({
                                        //     ['#06b6d4']:taskNoteMap.get("commRateTaskId#" + object.id) !== undefined && taskNoteMap.get("commRateTaskId#" + object.id).length > 0
                                        // })}
                                        className={"ml-1 hover:cursor-pointer"}
                                    />
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
                                    <FaRegMessage
                                        // color={clsx({
                                        //     ['#06b6d4']:taskNoteMap.get("commRateTaskId#" + object.id) !== undefined && taskNoteMap.get("commRateTaskId#" + object.id).length > 0
                                        // })}
                                        className={"ml-1 hover:cursor-pointer"}
                                    />
                                </div>
                            </TableCell>
                            <TableCell className={"text-[9pt] dark:text-[#dedfe1]"}>
                                {formatter.format(calculatedCommissionInfo.salesDollarValue)}
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2">
                                    <Tooltip content="Details">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <EyeIcon />
                                        </span>
                                    </Tooltip>
                                    <Tooltip content="Edit user">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <EditIcon />
                                        </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Revert back to Customer Level Config">
                                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                            <RxReset />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : <Spinner color={'default'} label={'Loading...'} />}
        </div>
    );
}
export default SalesPersonCalculatedCommission;