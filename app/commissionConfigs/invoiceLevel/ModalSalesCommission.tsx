"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { IoPersonSharp } from "react-icons/io5";
import SalesPersonCalculatedCommission from "@/app/commissionConfigs/invoiceLevel/SalesPersonCalculatedCommission";

const ModalSalesCommission = ({
                                  onOpen,
                                  onOpenChange,
                                  isOpen,
                                  invoiceId,
                                  customerJobInfo,
                                  order,
                                  taskId,
                                  customerInfo
                              }:any) => {

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
                                                <div className={"h-[20vh] w-[43vw]"}>
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
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default ModalSalesCommission;