import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Popover, PopoverContent, PopoverTrigger,
    Spinner,
    Tab,
    Tabs,
    useDisclosure
} from "@nextui-org/react";
import { IoPersonSharp } from "react-icons/io5";
import React from "react";

const ShowCustomerLevelConfig = ({isOpen, onOpenChange, customerInfoWithSalesEmployeeList, customerJobInfo})=>{

    return(
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop={"blur"} size={"md"} className={"rounded-md"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={"flex flex-col gap-1"}>
                                <span className={"dark:text-[#9898a1]"}>Customer-level Configuration</span>
                                <ul>
                                    <li className={"ml-5 text-[9pt] dark:text-[#9898a1]"}>
                                        CUSTOMER NAME: {customerJobInfo.customerName}
                                    </li>
                                    <li className={"ml-5 text-[9pt] dark:text-[#9898a1]"}>
                                        AR#: {customerJobInfo.arNumber}
                                    </li>
                                </ul>
                            </ModalHeader>
                            <ModalBody className={"dark:bg-[#222222]"}>
                                <div className="flex w-full flex-col">
                                    {(customerInfoWithSalesEmployeeList.salesPersonList)?.map((item) => (
                                        <div key={item.salesPersonId}></div>
                                    ))}
                                </div>
                            </ModalBody>
                            <ModalFooter className={"dark:bg-[#222222]"}>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary">
                                    <span>Save changes</span>
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
export default ShowCustomerLevelConfig;