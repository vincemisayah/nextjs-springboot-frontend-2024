'use client'

import { Spinner, Switch } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@nextui-org/button";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const EnableDisableConfig = ({customerId, invoiceNumber, taskItem})=>{
    const [loggedIn, setLoggedIn] = useState(3667);
    const [isSelected, setIsSelected] = React.useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { data: invoiceTaskRateInfo, data:invoiceTaskRateInfoError } = useSWR(invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceTaskRateInfo?invoiceID=" + invoiceNumber +
            "&taskID="+taskItem.taskID:null,
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
        console.log("taskRate = ", taskRate);
        // @ts-ignore
        OBJ_TO_SAVE.taskRate = Number(taskRate);


        const empCommRates = Array.from(document.getElementsByClassName("empCommRateInputTaskId#" + taskItem.taskID));
        empCommRates.forEach(elem => {
            const empId = (elem.id).split('#').at((elem.id).split('#').length - 1);
            // @ts-ignore
            const empRate = document.getElementById(elem.id).value;

            console.log(empId + ' -> ' + empRate);
            const empRateInfo = {
                empID: empId,
                salesRate: empRate
            }
            // @ts-ignore
            OBJ_TO_SAVE.empRates.push(empRateInfo);
        });
        console.log("OBJ_TO_SAVE = ", OBJ_TO_SAVE);

        setIsSaving(true);
        const response = await fetch("http://localhost:1118/invoiceCommissionService/invoiceLevel/saveInvoiceTaskConfig", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(OBJ_TO_SAVE)
        });
        console.log(response);
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
                <Switch
                    size={'sm'}
                    color={'default'}
                    defaultSelected={invoiceTaskRateInfo.active}
                    onValueChange={setIsSelected}

                    // onChange={(isSelected)=>{
                    //     console.log("val = ", isSelected.target.checked);
                    //     updateInvoiceLevelConfigStatus(isSelected.target.checked);
                    // }}
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
        <div>Failed to load invoice level config status</div>
    )
}
export default EnableDisableConfig;
