import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react";
import React from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { BlockingData } from "swr/_internal";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import { IoPersonSharp } from "react-icons/io5";
import useSWR from "swr";
import SalesPersonCalculatedCommission, { tabChange } from "@/app/commissionConfigs/invoiceLevel/SalesPersonCalculatedCommission";

// http://localhost:1118/invoiceCommissionService/customerlevel/customerInfo?invoiceId=208072

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const ModalSalesCommission = ({ onOpen, onOpenChange, isOpen, invoiceId, customerJobInfo, order, taskId}) => {
    const { data: customerInfo, error: customerInfoError } = useSWR(invoiceId > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerInfo?invoiceId=" + invoiceId:null,
        fetcher
    );


    // @ts-ignore
    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"} size={"5xl"} className={'rounded-md'}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={"flex flex-col gap-1 bg-[#fafafa] dark:bg-[#3c3c3c]"}>
                                <span>Salespeople Calculated Commission</span>
                                <ul>
                                    <li className={"ml-5 text-[9pt]"}>
                                        <strong>CUSTOMER NAME: </strong>{customerJobInfo.customerName}
                                        <span className={"ml-1 text-[#71717a]"}>(AR#: {customerJobInfo.arNumber})</span>
                                    </li>
                                    <li className={"ml-5 text-[9pt]"}>
                                        <strong>JOB INFO: </strong>{customerJobInfo.jobName}
                                        <span className={"ml-1 text-[#71717a]"}>(JOB#: {customerJobInfo.jobID}))</span>
                                    </li>
                                    <li className={"ml-5 text-[9pt]"}>
                                        <strong>INVOICE ID: </strong>{invoiceId}</li>
                                    {/*<li className={"ml-5 text-[9pt]"}>*/}
                                    {/*    <strong>TASK ID: </strong>{taskId}</li>*/}
                                    {/*<li className={"ml-5 text-[9pt]"}>*/}
                                    {/*    <strong>ORDER: </strong>{order}</li>*/}
                                </ul>
                            </ModalHeader>
                            <ModalBody className={"dark:bg-[#222222]"}>
                                <div className="flex w-full flex-col">
                                    <Tabs aria-label="Options"
                                          variant={'underlined'}
                                          color={'primary'}
                                          isVertical={true}>
                                        {/*@ts-ignore*/}
                                        {(customerInfo.salesPersonList)?.map((item, index)=>(
                                            <Tab key={index} title={
                                                <div className={'flex'}>
                                                    <IoPersonSharp className={'mt-[5px] mr-0.5'} size={11}/>
                                                    <p className={'text-[9pt]'}>{item.lastNameFirstName}</p>
                                                </div>
                                            }>
                                                <Card className="shadow-none">
                                                    <CardBody >
                                                        <SalesPersonCalculatedCommission customerID={customerJobInfo.customerID} invoiceID={invoiceId} taskID={taskId} orderNumber={order} employeeID={item.salesPersonId}/>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                </div>
                            </ModalBody>
                            <ModalFooter className={'dark:bg-[#222222]'}>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Save changes
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