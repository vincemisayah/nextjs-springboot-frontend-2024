"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { BlockingData } from "swr/_internal";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { IoPersonSharp } from "react-icons/io5";
import useSWR from "swr";
import SalesPersonCalculatedCommission from "@/app/commissionConfigs/invoiceLevel/SalesPersonCalculatedCommission";
import { router } from "next/client";
import AssignTaskAndEmployeeRates from "@/app/commissionConfigs/invoiceLevel/AssignTaskAndEmployeeRates";

// http://localhost:1118/invoiceCommissionService/customerlevel/customerInfo?invoiceId=208072

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());


const ModalSalesCommission = ({
                                  onOpen,
                                  onOpenChange,
                                  isOpen,
                                  invoiceId,
                                  customerJobInfo,
                                  order,
                                  taskId,
                                  customerInfo
                              }) => {

    const [loggedIn, setLoggedIn] = useState(3667);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState(undefined);



    const saveChanges = async () => {
        console.log("Saving . . . ");
        console.log("selectedEmpId= ", selectedEmpId);

        // console.log(document.getElementsByClassName('tabSalesEmployee'))

        // Scan through the tabs containing the sales employees' ID
        // and identify the target employee ID.
        let empID = undefined;
        const buttonsArr = Array.from(document.getElementsByClassName('tabSalesEmployee'));
        buttonsArr.forEach(btn=>{
            if(btn.ariaSelected === 'true'){
                // console.log('BTN = ', btn.children);
                const childrenElems = Array.from(btn.children);
                const targetChild = childrenElems.at(childrenElems.length-1);
                // @ts-ignore
                empID = (targetChild.firstElementChild.id).split('#').at((targetChild.firstElementChild.id).split('#').length-1);
            }
        })

        // @ts-ignore
        const taskRateInput = document.getElementById("taskRateForTaskID#" + taskId).value;
        // @ts-ignore
        const salesRateInput = document.getElementById("salesAssignedRateForTaskID#" + taskId).value;
        // @ts-ignore
        const textAreaTaskNote = document.getElementById("textAreaTaskNote#" +empID + "#taskId#"+taskId).value;
        // @ts-ignore
        const textAreaSalesNote = document.getElementById("textAreaSalesNote#"+empID+"#taskId#"+taskId).value;

        const TO_SAVE = {
            lastEditedBy: loggedIn,
            customerID: customerInfo.id,
            invoiceID: invoiceId,
            taskID: taskId,
            empID: Number(empID),
            taskRate: Number(taskRateInput),
            salesRate: Number(salesRateInput),
            taskNote: textAreaTaskNote,
            salesEmployeeNote: textAreaSalesNote,
        };

        console.log("TO SAVE = ", TO_SAVE);

        setIsSaving(true);
        const response = await fetch("http://localhost:1118/invoiceCommissionService/invoiceLevel/saveInvoiceLevelConfig", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(TO_SAVE)
        });
        console.log(response);
        if (200 <= response.status || response.status < 300) {
            setIsSaving(false);

        } else {
            setIsSaving(false);
            alert("Failed to save changes. Server response status: " + response.status);
        }
    };



    // @ts-ignore
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"} size={"5xl"} className={"rounded-md"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={"flex flex-col gap-1"}>
                                <span className={"dark:text-[#9898a1]"}>Salespeople Calculated Commission</span>
                                <ul>
                                    <li className={"ml-5 text-[9pt] dark:text-[#9898a1]"}>
                                        CUSTOMER NAME: {customerJobInfo.customerName}
                                        <span
                                            className={"ml-1 dark:text-[#9898a1]"}>(AR#: {customerJobInfo.arNumber})</span>
                                    </li>
                                    <li className={"ml-5 text-[9pt] dark:text-[#9898a1]"}>
                                        JOB INFO: {customerJobInfo.jobName}
                                        <span
                                            className={"ml-1 dark:text-[#9898a1]"}>(JOB#: {customerJobInfo.jobID}))</span>
                                    </li>
                                    <li className={"ml-5 text-[9pt] dark:text-[#9898a1]"}>
                                        INVOICE ID: {invoiceId}
                                    </li>
                                    {/*<li className={"ml-5 text-[9pt]"}>*/}
                                    {/*    <strong>TASK ID: </strong>{taskId}</li>*/}
                                    {/*<li className={"ml-5 text-[9pt]"}>*/}
                                    {/*    <strong>ORDER: </strong>{order}</li>*/}
                                </ul>
                            </ModalHeader>
                            <ModalBody className={"dark:bg-[#222222]"}>
                                <div className="flex w-full flex-col">
                                    <Tabs
                                        aria-label="Options"
                                        variant={"underlined"}
                                        color={"primary"}
                                        isVertical={true}>
                                        {/*@ts-ignore*/}
                                        {(customerInfo.salesPersonList)?.map((item) => (
                                            <Tab key={item.salesPersonId}
                                                 id={"tabSalesEmployeeId#" + item.salesPersonId}
                                                 className={"tabSalesEmployee"}
                                                 title={
                                                     <div id={"divContainerSalesEmpId#" + item.salesPersonId} className={"flex"}>
                                                         <IoPersonSharp className={"mt-[5px] mr-0.5"} size={11} />
                                                         <p className={"text-[9pt]"}>{item.lastNameFirstName}</p>
                                                     </div>
                                                 }
                                            >
                                                <div className={"h-[20vh] w-[43vw] border-2 border-amber-200"}>
                                                    {/*<AssignTaskAndEmployeeRates*/}
                                                    {/*    customerID={customerJobInfo.customerID}*/}
                                                    {/*    invoiceID={invoiceId}*/}
                                                    {/*    taskID={taskId}*/}
                                                    {/*    orderNumber={order}*/}
                                                    {/*    employeeID={item.salesPersonId}*/}
                                                    {/*/>*/}
                                                    <SalesPersonCalculatedCommission
                                                        customerID={customerJobInfo.customerID}
                                                        invoiceID={invoiceId}
                                                        taskID={taskId}
                                                        orderNumber={order}
                                                        employeeID={item.salesPersonId}
                                                    />
                                                </div>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                </div>
                            </ModalBody>
                            <ModalFooter className={"dark:bg-[#222222]"}>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={saveChanges} isDisabled={isSaving}>
                                    {isSaving ? (<span className={"min-w-[93px]"}><Spinner size={"sm"}
                                                                                           color={"white"} /></span>) :
                                        <span>Save changes</span>}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default ModalSalesCommission;