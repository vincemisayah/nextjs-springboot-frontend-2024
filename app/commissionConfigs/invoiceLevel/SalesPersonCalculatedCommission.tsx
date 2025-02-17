import useSWR from "swr";
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip
} from "@nextui-org/react";
import React, { useEffect, useRef } from "react";
import { PiNoteBlank, PiNoteBlankLight, PiNoteFill, PiPercentLight } from "react-icons/pi";
import { DeleteIcon, EditIcon, EyeIcon } from "@nextui-org/shared-icons";
import { RxReset } from "react-icons/rx";
import { FaRegMessage } from "react-icons/fa6";
import clsx from "clsx";
import { Button } from "@nextui-org/button";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const SalesPersonCalculatedCommission = ({customerID, invoiceID, taskID, orderNumber, employeeID}) =>{
    const divRef = useRef(null);
    const messageIconDivRef = useRef(null);

    const divRef2 = useRef(null);
    const messageIconDivRef2 = useRef(null);

    useEffect(( ) => {
        const table = document.getElementById("tableId#" + employeeID);
        // @ts-ignore
        table.style.opacity = "1";
    }, [employeeID]);

    useEffect(( ) => {
        const handleClickOutside = (event: { target: any; }) => {
            // @ts-ignore
            if (divRef.current && !divRef.current.contains(event.target) // @ts-ignore
                && (messageIconDivRef.current && !messageIconDivRef.current.contains(event.target))) {
                const textAreaDiv = document.getElementById('taskNote#' + employeeID + '#taskId#' + taskID);
                // @ts-ignore
                if(!textAreaDiv.hidden) { // @ts-ignore
                    textAreaDiv.hidden = true
                }
            }

            // @ts-ignore
            if (divRef2.current && !divRef2.current.contains(event.target) // @ts-ignore
                && (messageIconDivRef2.current && !messageIconDivRef2.current.contains(event.target))) {
                const textAreaDiv = document.getElementById('salesNote#' + employeeID + '#taskId#' + taskID);
                // @ts-ignore
                if(!textAreaDiv.hidden) { // @ts-ignore
                    textAreaDiv.hidden = true
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/finalSalesCalculatedCommissionInfo?` +
        `customerID=${customerID}` +
        `&invoiceID=${invoiceID}` +
        `&taskID=${taskID}` +
        `&orderNumber=${orderNumber}`+
        `&employeeID=${employeeID}`

    const { data: calculatedCommissionInfo, error: calculatedCommissionInfoError } = useSWR(invoiceID > 0?
            url : null,
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

    const showNote = (key:string)=>{
        const textAreaDiv = document.getElementById(key);
        // @ts-ignore
        if(textAreaDiv.hidden) { // @ts-ignore
            textAreaDiv.hidden = false
        }else{
            // @ts-ignore
            textAreaDiv.hidden = true
        }
    }

    return(
        <div id={'tableId#' + employeeID} className={'flex flex-row min-w-screen justify-center items-center opacity-0 transition-opacity ease-linear delay-150'}>
            {calculatedCommissionInfo != undefined ? (
                <Table
                    removeWrapper={true} isCompact>
                    <TableHeader>
                        <TableColumn className={'dark:bg-[#222222]'}>Amount</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Applied Config. Lvl</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Task Commission Value</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Assigned Rate Percent</TableColumn>
                        <TableColumn className={'dark:bg-[#222222]'}>Sales Commission</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            className={'border-b-small'}>
                            <TableCell className={'text-[10pt] dark:text-[#dedfe1]'}>
                                {formatter.format(calculatedCommissionInfo.amount)}
                            </TableCell>
                            <TableCell className={'text-[10pt] dark:text-[#dedfe1]'}>
                                {calculatedCommissionInfo.configLevel}
                            </TableCell>
                            <TableCell className={'text-[10pt] dark:text-[#dedfe1]'}>
                                <div className={"flex items-center ml-5"}>
                                    <span>{calculatedCommissionInfo.taskRate}%</span>
                                    <div ref={messageIconDivRef}>
                                        {calculatedCommissionInfo.taskRateNote.length > 0 ?
                                            (
                                                <>
                                                    <PiNoteFill size={16} className={"ml-1 hover:cursor-pointer"}
                                                                onClick={() => showNote("taskNote#" + employeeID + "#taskId#" + taskID)} />
                                                </>

                                            ) : (
                                                <>
                                                    <PiNoteBlank size={16} className={"ml-1 hover:cursor-pointer"}
                                                                 onClick={() => showNote("taskNote#" + employeeID + "#taskId#" + taskID)} />
                                                </>
                                            )}
                                    </div>
                                    <div ref={divRef} id={"taskNote#" + employeeID + "#taskId#" + taskID} hidden={true}>
                                        <div
                                            className={"bg-[#f4f4f5] dark:bg-[#4a4a50] absolute mt-3 z-10 rounded-lg border-small border-default-200 dark:border-default-100 p-1 shadow-xl"}>
                                            <textarea readOnly={true}
                                                id={"textAreaTaskNote#" + employeeID + "#taskId#" + taskID}
                                                className={"max-h-[120px] text-[10pt] dark:bg-[#27272a] rounded-lg border-small border-default-200 dark:border-default-100 p-2"}
                                                defaultValue={calculatedCommissionInfo.taskRateNote}
                                                rows={4} maxLength={150}>
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={"text-[10pt] dark:text-[#dedfe1]"}>
                                {formatter.format(calculatedCommissionInfo.taskCommissionDollarValue)}
                            </TableCell>
                            <TableCell className={"text-[10pt] dark:text-[#dedfe1]"}>
                                <div className={"flex items-center ml-5"}>
                                    <span>{calculatedCommissionInfo.salesPersonAssignedRate}%</span>
                                    <div ref={messageIconDivRef2}>
                                        {calculatedCommissionInfo.salesPersonAssignedRateNote.length > 0 ?
                                            (
                                                <>
                                                    <PiNoteFill size={16} className={"ml-1 hover:cursor-pointer"}
                                                                color={"#06b6d4"}
                                                                onClick={() => showNote("salesNote#" + employeeID + "#taskId#" + taskID)} />
                                                </>

                                            ) : (
                                                <>
                                                    <PiNoteBlank size={16} className={"ml-1 hover:cursor-pointer"}
                                                                 onClick={() => showNote("salesNote#" + employeeID + "#taskId#" + taskID)} />
                                                </>
                                            )}
                                    </div>
                                    <div ref={divRef2} id={"salesNote#" + employeeID + "#taskId#" + taskID}
                                         hidden={true}>
                                        <div
                                            className={"bg-[#f4f4f5] dark:bg-[#4a4a50] absolute mt-3 z-10 rounded-lg border-small border-default-200 dark:border-default-100 p-1 shadow-xl"}>
                                            <textarea readOnly={true}
                                                id={"textAreaSalesNote#" + employeeID + "#taskId#" + taskID}
                                                className={"max-h-[120px] text-[10pt] dark:bg-[#27272a] rounded border-small border-default-200 dark:border-default-100 p-2"}
                                                defaultValue={calculatedCommissionInfo.salesPersonAssignedRateNote}
                                                rows={4} maxLength={150}>
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={"text-[10pt] dark:text-[#dedfe1]"}>
                                {formatter.format(calculatedCommissionInfo.salesDollarValue)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : <Spinner color={'default'} label={'Loading...'} />}
        </div>
    );
}
export default SalesPersonCalculatedCommission;