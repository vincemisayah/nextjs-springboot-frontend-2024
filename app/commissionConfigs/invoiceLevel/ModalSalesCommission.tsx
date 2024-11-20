import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react";
import React from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { BlockingData } from "swr/_internal";


// @ts-ignore
const ModalSalesCommission = ({ onOpen, onOpenChange, isOpen, invoiceId, customerJobInfo, order }) => {
    // console.log("IN MODAL = ", customerJobInfo);
    return (
        <>
            {/*{customerJobInfo !== null? (*/}
            {/*    <>*/}
            {/*        <h1>{customerJobInfo.customerName}</h1>*/}
            {/*    </>*/}
            {/*):null}*/}
            {/*<Button size={"sm"} variant={"light"} onPress={onOpen}>View Salespeople Commission</Button>*/}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"} size={"5xl"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
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
                                    <li className={"ml-5 text-[9pt]"}>
                                        <strong>TASK ORDER: </strong>{order}</li>
                                </ul>
                                {/*<span className={"text-sm"}>Invoice ID:*/}
                                {/*<span className={"ml-2 font-mono"}>{customerJobInfo.customerName}</span>*/}
                                {/*<span className={"ml-2 font-mono"}>{customerJobInfo.jobName}</span>*/}
                                {/*<span className={"ml-2 font-mono"}>{invoiceId}</span>*/}
                                {/*</span>*/}
                            </ModalHeader>
                            <ModalBody>
                                <Table aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>NAME</TableColumn>
                                        <TableColumn>ROLE</TableColumn>
                                        <TableColumn>STATUS</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="1">
                                            <TableCell>Tony Reichert</TableCell>
                                            <TableCell>CEO</TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                        <TableRow key="2">
                                            <TableCell>Zoey Lang</TableCell>
                                            <TableCell>Technical Lead</TableCell>
                                            <TableCell>Paused</TableCell>
                                        </TableRow>
                                        <TableRow key="3">
                                            <TableCell>Jane Fisher</TableCell>
                                            <TableCell>Senior Developer</TableCell>
                                            <TableCell>Active</TableCell>
                                        </TableRow>
                                        <TableRow key="4">
                                            <TableCell>William Howard</TableCell>
                                            <TableCell>Community Manager</TableCell>
                                            <TableCell>Vacation</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
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