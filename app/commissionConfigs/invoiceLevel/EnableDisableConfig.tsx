'use client'

import { Switch } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const EnableDisableConfig = ({invoiceNumber, taskItem})=>{
    const [loggedIn, setLoggedIn] = useState(3667);
    const [isSelected, setIsSelected] = React.useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { data: invoiceTaskRateInfo, data:invoiceTaskRateInfoError } = useSWR(invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceTaskRateInfo?invoiceID=" + invoiceNumber +
            "&taskID="+taskItem.taskID:null,
        fetcher
    );



    useEffect(() => {
        // console.log("USE EFFECT . . . selected = ", isSelected);
        // console.log('invoiceTaskRateInfo = ', invoiceTaskRateInfo);
        // setIsSelected(invoiceTaskRateInfo.active)
        updateInvoiceLevelConfigStatus();
    }, [isSelected]);


    const updateInvoiceLevelConfigStatus = async () => {
        // console.log("updateInvoiceLevelConfigStatus isSelected . . . ");
        // console.log('isSelected = ', isSelected);
        // console.log('taskItem = ', taskItem);

        const OBJ_TO_SAVE = {
            assignedBy: loggedIn,
            active: isSelected,
            taskID: taskItem.taskID,
            taskRate: undefined,
            empRates: [],
        }

        // @ts-ignore
        const taskRate = document.getElementById("invoiceLevelCommRateInput#" + taskItem.taskID).value;
        console.log("taskRate = ", taskRate);
        OBJ_TO_SAVE.taskRate = taskRate;


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
        // console.log("invoiceTaskRateInfo = ", invoiceTaskRateInfo)
        // console.log("ACTIVE = ", invoiceTaskRateInfo.active)
        // if(invoiceTaskRateInfo.active){
            return(
                <div>
                    <Switch
                        size={'sm'}
                        color={'default'}
                        defaultSelected={invoiceTaskRateInfo.active}
                        onValueChange={setIsSelected}/>
                </div>
            )
        // }
        // else{
        //     return (
        //         <div>
        //             <Switch onChange={foo2}
        //                 size={"sm"}
        //                 color={"default"}
        //                 defaultSelected={false} onValueChange={setIsSelected} />
        //         </div>
        //     )
        // }
    }

    // return (
    //     <>
    //         <Switch onChange={enableDisableConfig}
    //                 size={"sm"}
    //                 color={"default"}
    //                 isSelected={isSelected} onValueChange={setIsSelected} />
    //         {/*<p className="text-small text-default-500">Config: {isSelected ? "Enabled" : "Disabled"}</p>*/}
    //     </>
    // );

    return (
        <div>Failed to load invoice level config status</div>
    )
}
export default EnableDisableConfig;
