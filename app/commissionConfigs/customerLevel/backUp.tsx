import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Skeleton, Spacer, Spinner } from "@nextui-org/react";
import {Card} from "@nextui-org/react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/modal";
import {
    Listbox,
    ListboxItem
} from "@nextui-org/listbox";
import { HiMiniUsers } from "react-icons/hi2";
import { ListboxWrapper } from "../util/ListboxWrapper";
import { RiPercentFill } from "react-icons/ri";
import { TbPercentage } from "react-icons/tb";
import { PiPercentLight, PiPercentThin } from "react-icons/pi";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoiceTasksByDepartment = (props: { url: any; }) => {
    const [startFetching, setStartFetching] = useState(false);
    const [startFetchingTaskItems, setStartFetchingTaskItems] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [arNumber, setArNumber] = useState("");
    const [customerId, setCustomerId] = useState(-1);
    const [customerName, setCustomerName] = useState("");
    const [selectedTaskItems] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [salesPersonList, setSalesPersonList] = useState([]);
    const [taskCommRates] = useState([
        {taskID:100,
            commRate:4.25,
            assignedBy:3667,
            notes:"Test note"}
    ]);

    const [assignedTaskCommissionRates, setAssignedTaskCommissionRates] = useState([]);

    const [mapTaskCommRates] = useState(new Map( ));



    const handleClick = (arNumber: string, customerId:number, customerName:string, salesPersonList:string[]) => {
        console.log("handleClick . . . ")

        setStartFetchingTaskItems(true);
        setArNumber(arNumber);
        setCustomerId(customerId);
        setCustomerName(customerName);
        // @ts-ignore
        setSalesPersonList(salesPersonList);

        // commRateTaskId#100


        mapTaskCommRates.set('commRateTaskId#100', taskCommRates[0].commRate);

        // assignedTaskCommissionRates.forEach(obj =>{
        //    console.log("Object Rate = ", obj);
        // });
    };

    const handleChange = (e: any) => {
        setStartFetchingTaskItems(false);
        setStartFetching(true);
        setSearchTerm(e.target.value);
    };

    // @ts-ignore
    const SearchResults = ({ url, keyword }) => {
        const { data, error } = useSWR(
            `${url + keyword}`,
            fetcher
        );

        if (error) return <div>failed to load</div>;
        if (!data) return (
            <div className={'mx-2 pt-5'} >
                <Card className="w-[200px] space-y-5 p-4" radius="lg">
                    <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>
                </Card>
            </div>
        );

        if (!data[0]) return <div>not found</div>;

        return (
            <div className={'overflow-auto'}>
                <ScrollShadow className={"h-[50vh]"} hideScrollBar={true}>
                    <Table selectionMode={'single'}>
                        <TableHeader>
                            <TableColumn>AR</TableColumn>
                            <TableColumn>Customer ID</TableColumn>
                            <TableColumn>Customer Name</TableColumn>
                            <TableColumn className={'min-w-[20ch]'}>
                                <div className={'flex'}>
                                    <HiMiniUsers  size={'19'}/>
                                    <Spacer x={1}/>
                                    Sales
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((object: any, index: React.Key | null | undefined) => (
                                <TableRow className={'cursor-pointer'} key={index} onClick={() => handleClick(object.arNumber, object.id, object.name, object.salesPersonList)}>
                                    <TableCell>{object.arNumber}</TableCell>
                                    <TableCell>{object.id}</TableCell>
                                    <TableCell>{object.name}</TableCell>
                                    <TableCell>
                                        {object.salesPersonList.length > 0?
                                            <ul>
                                                {object.salesPersonList.map((name:any, index:any) =>(
                                                    <li key={index}>&#8226;{' ' + name.lastNameFirstName}</li>
                                                ))}
                                            </ul>: <span className={'text-red-500'}>N/A</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollShadow>
            </div>
        );
    };

    const CollectSelectedTaskItems = ( ) =>{
        console.log('CollectSelectedTaskItems . . . ')
        const rows = document.getElementsByClassName("taskRow");

        if(selectedTaskItems.length > 0){
            selectedTaskItems.splice(0, selectedTaskItems.length)
        }
        for(let i = 0; i < rows.length; i++){
            if(rows[i].getAttribute("aria-selected") === 'true'){
                // @ts-ignore
                selectedTaskItems.push(rows[i].id);
            }
        }
        console.log("selectedTaskItems = ", selectedTaskItems)
        onOpen( );
    }

    const ToolsModule = ( ) =>{
        return(
            <>
                <div>
                    <span className={"ml-1"}>Auto-populate Tools</span>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-row gap-4 p-2 border-1 rounded-lg shadow-sm bg-[#f4f4f5] dark:bg-[#27272a]">
                            <div>
                                <ListboxWrapper>
                                    <Listbox variant="flat" selectionMode="multiple">
                                        {salesPersonList.map((sales: any, index: any) => (
                                            <ListboxItem key={index}>
                                                {sales.lastNameFirstName}
                                            </ListboxItem>
                                        ))}
                                    </Listbox>
                                </ListboxWrapper>
                            </div>
                            <div className={"p-4 align-middle"}>
                                <input type={"text"} maxLength={5} className={"w-[8ch] pr-2 pl-2 border-small border-default-200 dark:border-default-100"} />
                                <Spacer y={5} />
                                <Button size={"sm"}>Fill in fields</Button>
                            </div>
                        </div>
                        <div>
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const InvoiceTaskItems = (arg: { arNumber: string }) => {
        const { data, error } = useSWR(
            "http://localhost:1118/invoiceCommissionService/customerlevel/invoiceDepartmentList",
            fetcher
        );

        if (error) return <div>failed to load</div>;
        if (!data) return <div><Spinner color={"default"} /></div>;
        if (!data[0]) return <div>not found</div>;

        // @ts-ignore
        const DepartmentInvoiceTaskItems = ({ deptId }) => {
            const { data, error } = useSWR(
                "http://localhost:1118/invoiceCommissionService/customerlevel/invoiceTaskItemListByDeptId?deptId=" + deptId,
                fetcher
            );

            const { data: taskRates, error: taskRatesError } = useSWR(
                "http://localhost:1118/invoiceCommissionService/customerlevel/taskCommissionRates?customerID=" + customerId,
                fetcher
            );

            const { data:empAssignedRates, error:empAssignedRatesError } = useSWR(
                "http://localhost:1118/invoiceCommissionService/customerlevel/customerEmployeeAssignedRates?customerID=" + customerId,
                fetcher
            );

            const taskRateMap = new Map();
            if(taskRates){
                taskRates.forEach((elem: any)=>{
                    taskRateMap.set(elem.mapKey, elem.rate);
                })
            }

            const empAssignedRatesMap = new Map();
            if(empAssignedRates){
                empAssignedRates.forEach((elem: any)=>{
                    empAssignedRatesMap.set(elem.mapKey, elem.assignedRate);
                })
            }

            if (error) return <div>failed to load</div>;
            if (!data) return <div>loading...</div>;
            if (!data[0]) return <div>not found</div>;

            return (
                <div className={"border-1 p-3 rounded-lg"}>
                    <ToolsModule/>
                    <Spacer y={5} />
                    <Table removeWrapper selectionMode={"none"}>
                        <TableHeader>
                            <TableColumn>Task Name</TableColumn>
                            <TableColumn>Description</TableColumn>
                            <TableColumn>Task Comm. Rate</TableColumn>
                            {/*@ts-ignore*/}
                            {salesPersonList.map((name: any, index: any) => (
                                <TableColumn key={index}>{name.lastNameFirstName}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {data?.map((object: any, index: React.Key | null) => (
                                <TableRow key={"taskId#" + object.id} id={"taskId#" + object.id} className={"taskRow"}>
                                    <TableCell>{object.taskName}</TableCell>
                                    <TableCell>{object.description}</TableCell>
                                    <TableCell>
                                        <div className={"flex"}>
                                            <input id={"commRateTaskId#" + object.id}
                                                   type={"text"}
                                                   maxLength={5}
                                                   className={"commRateInput w-[7ch] rounded pr-2 pl-2 text-center border-small border-default-200 dark:border-default-100"}
                                                   defaultValue={taskRateMap.get("commRateTaskId#" + object.id)} />
                                            <PiPercentLight className={'ml-1'} size={17}/>
                                        </div>
                                    </TableCell>
                                    {/*@ts-ignore*/}
                                    {salesPersonList.map((sales: any, index: any) => (
                                        <TableCell key={index + "taskId#" + object.id + "#salesId#" + sales.salesPersonId}>
                                            <div className={"flex"}>
                                                <input id={"taskId#" + object.id + "#salesId#" + sales.salesPersonId}
                                                       type={"text"} maxLength={5}
                                                       className={"w-[7ch] pr-2 pl-2 text-center border-small border-default-200 dark:border-default-100"}
                                                       defaultValue={empAssignedRatesMap.get("taskId#" + object.id + "#salesId#" + sales.salesPersonId)}/>
                                                <PiPercentLight className={'ml-1'} size={17}/>
                                            </div>

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            );
        }

        const ViewSelectedCustomer = () => {

            return (
                <div className={"mb-5 w-[65%]"}>
                    <h1 className={"pb-5"}>This configuration will apply to the following customer's assigned sales
                        people.</h1>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>AR Number</TableColumn>
                            <TableColumn>Customer ID</TableColumn>
                            <TableColumn>Customer Name</TableColumn>
                            <TableColumn className={"min-w-[20ch]"}>
                                <div className={"flex"}>
                                    <HiMiniUsers  size={'19'}/>
                                    <Spacer x={1}/>
                                    Sales
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>{arNumber}</TableCell>
                                <TableCell>{customerId}</TableCell>
                                <TableCell>{customerName}</TableCell>
                                <TableCell>
                                    {salesPersonList.length > 0?
                                        <ul>
                                            {salesPersonList.map((person:any, index:any) =>(
                                                <li key={index}>&#8226;{' ' + person.lastNameFirstName}</li>
                                            ))}
                                        </ul>: <span className={'text-red-500'}>N/A</span>}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Spacer y={5}/>
                </div>
            );
        }

        return (
            <>
                <ViewSelectedCustomer />
                <div className={"pb-5"}>
                    <span className={"text-1xl text-slate-700"}>
                        Select the invoice department to view their associated task items</span>
                </div>
                <div className="task-dept-container flex flex-col">
                    <Accordion selectionMode="multiple" isCompact className={'w-full'}>
                        {data?.map((object: any, index: React.Key | null | undefined) => (
                            <AccordionItem key={index} aria-label="Accordion 1"
                                           title={<span
                                               className={"font-bold text-lg text-cyan-700"}>{object.department}</span>}>
                                <DepartmentInvoiceTaskItems deptId={object.id} />
                            </AccordionItem>))}
                    </Accordion>
                </div>
            </>
        );
    };

    function StickyDisplaySelectedTaskItems() {
        return (
            <div className="w-full min-w-fit max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 h-fit sticky top-40">
                <Listbox className={'w-[100px]'}>
                    {selectedTaskItems.map((object,index)=>(
                        <ListboxItem key={index}>{object}</ListboxItem>
                    ))}
                </Listbox>
                <Button onClick={CollectSelectedTaskItems} >Assign Commission Rates</Button>
            </div>
        );
    }

    // @ts-ignore
    return (
        <>
            <div className="flex">
                <div className={"space-y-4"}>
                    <input className={"border-1 border-slate-600 w-full max-w-64"}
                           type="text"
                           value={searchTerm}
                           onChange={handleChange}
                           id="series" />{" "}
                    <br />
                    {startFetching && <SearchResults keyword={searchTerm} url={props.url} />}
                </div>
                <Spacer x={14} />
                <div>
                    {startFetchingTaskItems && <InvoiceTaskItems arNumber={arNumber} />}
                </div>
                <Spacer x={5} />
                <StickyDisplaySelectedTaskItems/>
                {/*{selectedTaskItems &&  <StickyDisplaySelectedTaskItems/>}*/}
            </div>

            <Modal
                size={'5xl'}
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                {selectedTaskItems?.map((object: any, index: React.Key | null | undefined) => (
                                    <div key={index}>{object}</div>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default DisplayInvoiceTasksByDepartment;