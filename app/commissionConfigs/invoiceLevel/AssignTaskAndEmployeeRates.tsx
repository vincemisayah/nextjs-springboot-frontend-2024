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
const AssignTaskAndEmployeeRates = ({customerID, invoiceID, taskID, orderNumber, employeeID}) =>{
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
        <div id={'tableId#' + employeeID} className={'opacity-0 transition-opacity ease-linear delay-150 border-red-500 border-2'}>
            {calculatedCommissionInfo !== undefined ? (
                <div className={'border-1'}>
                    <Spinner color={'default'} label={'Loading...'} />
                </div>
            ) : <Spinner color={'default'} label={'Loading...'} />}
        </div>
    );
}
export default AssignTaskAndEmployeeRates;