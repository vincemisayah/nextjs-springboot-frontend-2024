'use client'

import { Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@nextui-org/button";
import { IoInformationCircleSharp } from "react-icons/io5";
import {Switch} from "@nextui-org/react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const EnableDisableConfig = ({customerId, invoiceNumber, taskItem})=>{
    const [loggedIn, setLoggedIn] = useState(-1);
    const [isSelected, setIsSelected] = React.useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const userID = Number(localStorage.getItem("userID"));
        if(userID !== null)
            setLoggedIn(userID);
    }, [localStorage.getItem("userID")]);

    const { data: invoiceTaskRateInfo, data:invoiceTaskRateInfoError } = useSWR(invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/invoiceTaskRateInfo?invoiceID=${invoiceNumber}&taskID=${taskItem.taskID}`:null,
        fetcher
    );


    const updateInvoiceLevelConfigStatus = async () => {
        setIsSaving(true);
        const OBJ_TO_SAVE = {
            lastEditedBy: loggedIn,
            customerID: customerId,
            invoiceID: invoiceNumber,
            taskID: taskItem.taskID,
            taskRate: undefined,
            active: isSelected,
            notes: '',
            empRates: []
        }

        // @ts-ignore
        const taskRate = document.getElementById("invoiceLevelCommRateInput#" + taskItem.taskID).value;

        // @ts-ignore
        OBJ_TO_SAVE.taskRate = Number(taskRate);


        const empCommRates = Array.from(document.getElementsByClassName("empCommRateInputTaskId#" + taskItem.taskID));

        empCommRates.forEach(elem => {
            const empId = (elem.id).split('#').at(1);
            // @ts-ignore
            const empRate = document.getElementById(elem.id).value;
            const empRateInfo = {
                empID: empId,
                salesRate: empRate,
                note:''
            }
            // @ts-ignore
            OBJ_TO_SAVE.empRates.push(empRateInfo);
        });
        setIsSaving(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/saveInvoiceTaskConfig`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(OBJ_TO_SAVE)
        });
        if (200 <= response.status || response.status < 300) {
            setIsSaving(false);

        } else {
            setIsSaving(false);
            alert("Failed to save changes. Server response status: " + response.status);
        }
    }

    if(invoiceTaskRateInfo){
        return(
            <div className={'flex'}>
                <Popover placement="bottom" showArrow={true}>
                    <PopoverTrigger>
                        <div>
                            <IoInformationCircleSharp size={17} className={'hover:cursor-pointer mr-0.5'}/>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-1 py-2">
                            <div className="text-tiny">
                                If disabled, the program will resort to
                                <br/>using the customer-level configuration
                                <br/>assigned to this invoice task item.
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Switch
                    size={'sm'}
                    color={'default'}
                    defaultSelected={invoiceTaskRateInfo.active}
                    onValueChange={setIsSelected}
                />
                <Button onPress={updateInvoiceLevelConfigStatus}
                    size={'sm'}>
                    <span id={'saveBtnTaskId#'+taskItem.taskID}>
                        {isSaving?
                            <Spinner color={'primary'} size={'sm'}/>
                            : (<p>Save</p>)}
                    </span>
                </Button>
            </div>
        )
    }

    return (
        // <div>Failed to load invoice level config status</div>
        <div className={'flex'}>

            <Button onPress={updateInvoiceLevelConfigStatus}
                    size={'sm'}>
                    <span id={'saveBtnTaskId#'+taskItem.taskID}>
                        {isSaving?
                            <Spinner color={'primary'} size={'sm'}/>
                            : (<p>Save</p>)}
                    </span>
            </Button>
            {/*<Switch defaultSelected aria-label="Automatic updates" />*/}
        </div>
    )
}
export default EnableDisableConfig;
