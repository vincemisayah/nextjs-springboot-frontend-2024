import React, { useState } from "react";
import useSWR from "swr";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
    Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger,
    Skeleton,
    Spacer,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { HiMiniUsers } from "react-icons/hi2";
import { ListboxWrapper } from "../util/ListboxWrapper";
import { PiPercentLight } from "react-icons/pi";
import SendAndSaveData from "@/app/commissionConfigs/customerLevel/SendAndSaveData";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { FcComments } from "react-icons/fc";
import { FaCircleInfo, FaRegMessage } from "react-icons/fa6";
import { Textarea } from "@nextui-org/input";
import { IoClipboardSharp, IoPerson } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import clsx from "clsx";
import { FaToolbox } from "react-icons/fa";
import { GoHorizontalRule, GoPlus } from "react-icons/go";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoiceTasksByDepartment = (props: { url: any; }) => {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(3667);
    const [startFetching, setStartFetching] = useState(false);
    const [startFetchingTaskItems, setStartFetchingTaskItems] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [arNumber, setArNumber] = useState("");
    const [customerId, setCustomerId] = useState(-1);
    const [customerName, setCustomerName] = useState("");
    const [selectedTaskItems] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [salesPersonList, setSalesPersonList] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    const handleClick = (arNumber: string, customerId: number, customerName: string, salesPersonList: string[]) => {
        setStartFetchingTaskItems(true);
        setArNumber(arNumber);
        setCustomerId(customerId);
        setCustomerName(customerName);
        // @ts-ignore
        setSalesPersonList(salesPersonList);
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
            <div className={"mx-2 pt-5"}>
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
            <div className={"overflow-auto"}>
                <ScrollShadow className={"h-[50vh]"} hideScrollBar={true}>
                    <Table selectionMode={"single"}>
                        <TableHeader>
                            <TableColumn>AR</TableColumn>
                            <TableColumn>Customer ID</TableColumn>
                            <TableColumn>Customer Name</TableColumn>
                            <TableColumn className={"min-w-[20ch]"}>
                                <div className={"flex"}>
                                    <HiMiniUsers size={"19"} />
                                    <Spacer x={1} />
                                    Sales
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((object: any, index: React.Key | null | undefined) => (
                                <TableRow className={"cursor-pointer"} key={index}
                                          onClick={() => handleClick(object.arNumber, object.id, object.name, object.salesPersonList)}>
                                    <TableCell>{object.arNumber}</TableCell>
                                    <TableCell>{object.id}</TableCell>
                                    <TableCell>{object.name}</TableCell>
                                    <TableCell>
                                        {object.salesPersonList.length > 0 ?
                                            <ul>
                                                {object.salesPersonList.map((name: any, index: any) => (
                                                    <li key={index}>&#8226;{" " + name.lastNameFirstName}</li>
                                                ))}
                                            </ul> : <span className={"text-red-500"}>N/A</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollShadow>
            </div>
        );
    };

    const CollectSelectedTaskItems = () => {
        console.log("CollectSelectedTaskItems . . . ");
        const rows = document.getElementsByClassName("taskRow");

        if (selectedTaskItems.length > 0) {
            selectedTaskItems.splice(0, selectedTaskItems.length);
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].getAttribute("aria-selected") === "true") {
                // @ts-ignore
                selectedTaskItems.push(rows[i].id);
            }
        }
        onOpen();
    };



    // @ts-ignore
    const ToolsModule = ({ deptID }) => {
        const postData = async (data: { taskId: undefined; taskRate: undefined; salesAssignedRates: never[]; }[])=>{
            while(true) {
                // setIsSaving(true);
                const spinnerDiv = document.getElementById('spinnerDivDeptId#' + deptID);
                // @ts-ignore
                spinnerDiv.hidden = false;

                // "spinnerDeptId#" + deptID
                const spinner = document.getElementById('spinnerDeptId#' + deptID);

                spinner.textContent = 'Saving changes . . . '
                const response = await fetch('http://localhost:1118/invoiceCommissionService/customerlevel/saveCustomerLevelConfig',{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                })

                // "spinnerDeptId#" + deptID
                if(200 <= response.status || response.status < 300){
                    // @ts-ignore
                    spinnerDiv.hidden = true;
                    spinner.style.color = '#19b9d4'
                    spinner.textContent = 'Success!'

                    setTimeout(() => {
                        spinner.style.color = 'grey'
                        spinner.textContent = ''
                    }, "1500");

                    // router.refresh();
                    break;
                }else{
                    // setIsSaving(false);
                    alert('Failed to save changes. Server response status: ' + response.status)
                    spinner.textContent = 'Save attempt failed'
                    // @ts-ignore
                    setTimeout(() => {
                        spinnerDiv.hidden = true;
                    }, "1500");
                    // router.refresh();
                    break;
                }
            }

            // 'spinnerDivDeptId#' + deptID

            // router.refresh();
        }

        const saveChanges = () =>{
            let arrayRateInfos: { taskId: undefined; taskRate: undefined; salesAssignedRates: never[]; }[] = [];

            const collectionOfRows = document.getElementsByClassName("taskRowDeptId#" + deptID);
            const rows = Array.from(collectionOfRows);
            rows.forEach((row: any, index: any) => {
                const tdChildren = Array.from(row.children);

                const rateInfo = {
                    customerID: customerId,
                    taskId: undefined,
                    taskRate:undefined,
                    taskNote:undefined,
                    lastEditBy: loggedIn,
                    salesAssignedRates:[]
                };



                const TASK_COMM_RATE_COLUMN_INDEX = 2;
                for(let i = TASK_COMM_RATE_COLUMN_INDEX; i < tdChildren.length; i++) {
                    // @ts-ignore
                    const taskCommRate = Array.from(tdChildren[i].getElementsByTagName("input"))[0].value;

                    if(i === TASK_COMM_RATE_COLUMN_INDEX){
                        // @ts-ignore
                        const inputID = Array.from(tdChildren[i].getElementsByTagName("input"))[0].id;
                        // @ts-ignore
                        rateInfo.taskId = inputID.split('#').at(inputID.split('#').length - 1);

                        // @ts-ignore
                        rateInfo.taskRate = Array.from(tdChildren[i].getElementsByTagName("input"))[0].value;

                        const taskRateNote = document.getElementById("textAreaTaskNote#" + rateInfo.taskId);

                        // @ts-ignore
                        rateInfo.taskNote = taskRateNote.value;
                    }

                    if(i > TASK_COMM_RATE_COLUMN_INDEX){
                        const salesPerson = {
                            empId: undefined,
                            assignedRate: undefined,
                            salesNote: undefined
                        }

                        // @ts-ignore
                        const inputID = Array.from(tdChildren[i].getElementsByTagName("input"))[0].id;
                        salesPerson.empId = inputID.split('#').at(inputID.split('#').length - 1)
                        // @ts-ignore
                        salesPerson.assignedRate = Array.from(tdChildren[i].getElementsByTagName("input"))[0].value;

                        const salesNote = document.getElementById("textAreaSalesNote#" + salesPerson.empId + "#taskId#" + rateInfo.taskId);
                        // @ts-ignore
                        salesPerson.salesNote = salesNote.value;

                        // @ts-ignore
                        rateInfo.salesAssignedRates.push(salesPerson)
                    }
                }

                if(rateInfo.taskRate !== undefined && rateInfo.taskRate !== ''){
                    arrayRateInfos.push(rateInfo);
                }
            })

            if(arrayRateInfos.length > 0){
                // @ts-ignore
                postData(arrayRateInfos);
            }
        }

        const fillSelectedSalesPersonFields = ( ) =>{
            const liArray = Array.from(document.getElementsByClassName('salesPersonItemDeptId#' + deptID)) ;
            const salesIdArr: any[] = [];
            liArray.forEach((item: any) => {
                if(item.ariaSelected === 'true'){
                    // @ts-ignore
                    salesIdArr.push(Array.from(item.getElementsByTagName('p'))[0].id)
                }
            })

            const table = document.getElementById('tableInvoiceTaskItemsDeptId#' + deptID);
            // @ts-ignore
            const tbody = Array.from(table.getElementsByTagName('tbody'))[0]
            const tRows =  Array.from(tbody.getElementsByTagName('tr'))

            tRows.forEach(row =>{
                const taskId = (row.id).split('#').at((row.id).split('#').length - 1);
                salesIdArr.forEach((salesId) => {
                    const inputField = document.getElementById('taskId#' + taskId + '#salesId#' + salesId);
                    // @ts-ignore
                    inputField.value = document.getElementById('toFillValueInputDeptId#' + deptID).value;
                })
            })
        }

        return (
            <>
                <Accordion       motionProps={{
                    variants: {
                        enter: {
                            y: 0,
                            opacity: 1,
                            height: "auto",
                            transition: {
                                height: {
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    duration: 1,
                                },
                                opacity: {
                                    easings: "ease",
                                    duration: 1,
                                },
                            },
                        },
                        exit: {
                            y: -10,
                            opacity: 0,
                            height: 0,
                            transition: {
                                height: {
                                    easings: "ease",
                                    duration: 0.25,
                                },
                                opacity: {
                                    easings: "ease",
                                    duration: 0.3,
                                },
                            },
                        },
                    },
                }}>
                    <AccordionItem key="anchor" aria-label="Anchor"
                                   indicator={<></>}
                                   // indicator={<FaToolbox />}
                                   title={<div className={'flex gap-2 text-[#71717a] hover:text-cyan-500 text-[12pt]'}><FaToolbox className={'mt-1.5'} size={15}/> Field Populator Tools</div>}>
                        <div className={'p-2'}>
                            <div className="flex flex-row gap-4">
                                <div className="flex flex-row gap-4 p-2 rounded-lg shadow-sm bg-[#f4f4f5] dark:bg-[#27272a] border-small border-default-200 dark:border-default-100">
                                    <ListboxWrapper>
                                        <Listbox variant={'flat'} selectionMode="multiple" className={'bg-gray-50 dark:bg-[#18181b] rounded-lg'}>
                                            {salesPersonList.map((sales: any, index: any) => (
                                                <ListboxItem key={sales.salesPersonId}
                                                             className={"salesPersonItemDeptId#" + deptID}>
                                                    <p id={sales.salesPersonId}>{sales.lastNameFirstName}</p>
                                                </ListboxItem>
                                            ))}
                                        </Listbox>
                                    </ListboxWrapper>
                                    <div className={"p-4 align-middle"}>
                                        <input
                                            id={"toFillValueInputDeptId#" + deptID}
                                            type={"text"}
                                            maxLength={5}
                                            placeholder={'Rate %'}
                                            className={"text-center w-[8ch] pr-2 pl-2 border-small border-default-200 dark:border-default-100 rounded"} />
                                        <Spacer y={5} />
                                        <Button size={"sm"} onPress={fillSelectedSalesPersonFields}>Fill in fields</Button>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 p-2 rounded-lg shadow-sm bg-[#f4f4f5] dark:bg-[#27272a] rounded-small border-small border-default-200 dark:border-default-100 max-w-44">
                                    <div className={"align-middle text-center p-1"}>
                                        <span className={"mx-auto text-[10pt]"}>Task Commission Rate</span>
                                        <br/>
                                        <Spacer y={2} />
                                        <input
                                            id={"toFillValueInputTaskCommRateDeptId#" + deptID}
                                            placeholder={'Rate %'}
                                            type={"text"}
                                            maxLength={5}
                                            className={"w-[8ch] pr-2 pl-2 border-small border-default-200 dark:border-default-100 text-center rounded"} />
                                        <Spacer y={5} />
                                        <Button size={"sm"} onPress={fillSelectedSalesPersonFields}>Fill in fields</Button>
                                    </div>
                                </div>
                                <div>
                                    <Button onPress={saveChanges}>Save Changes</Button>
                                </div>

                                <div className={"m-auto"}>
                                    <div id={"spinnerDivDeptId#" + deptID} hidden={true} className={"ml-16"}>
                                        <Spinner color="default" />
                                    </div>
                                    <div>
                                <span id={"spinnerDeptId#" + deptID}
                                      className={"text-[16pt] font-medium select-none text-[gray]"}></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>


            </>
        );
    };

    const InvoiceTaskItems = (arg: { arNumber: string }) => {
        const { data, error } = useSWR(
            "http://localhost:1118/invoiceCommissionService/customerlevel/invoiceDepartmentList",
            fetcher
        );

        if (error) return <div>failed to load</div>;
        if (!data) return <div><Spinner color={"default"} size={"lg"} /></div>;
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

            const { data: empAssignedRates, error: empAssignedRatesError } = useSWR(
                "http://localhost:1118/invoiceCommissionService/customerlevel/customerEmployeeAssignedRates?customerID=" + customerId,
                fetcher
            );

            const salesNoteMap = new Map();
            const taskRateMap = new Map();
            const taskNoteMap = new Map();
            const lastEditByMap = new Map();

            if (empAssignedRates && !empAssignedRatesError) {
                empAssignedRates.forEach((elem: any) => {
                    salesNoteMap.set(elem.mapKey, elem.notes);
                });
            }

            if (taskRates && !taskRatesError) {
                taskRates.forEach((elem: any) => {
                    taskRateMap.set(elem.mapKey, elem.rate);
                    taskNoteMap.set(elem.mapKey, elem.notes);
                    lastEditByMap.set(elem.mapKey, elem.assignedBy);
                });
            }

            const empAssignedRatesMap = new Map();
            if (empAssignedRates && !empAssignedRatesError) {
                empAssignedRates.forEach((elem: any) => {
                    empAssignedRatesMap.set(elem.mapKey, elem.assignedRate);
                });
            }

            if (error) return <div>failed to load</div>;
            if (!data) return <div>loading...</div>;
            if (!data[0]) return <div>not found</div>;

            const showSalesNote = (key:string)=>{
                const textAreaDiv = document.getElementById(key);
                if(salesPersonList.length > 1){
                    // @ts-ignore
                    if(textAreaDiv.hidden) { // @ts-ignore
                        textAreaDiv.hidden = false
                    }else{
                        // @ts-ignore
                        textAreaDiv.hidden = true
                    }

                    const empID = key.split('#')[1];
                    const taskID = key.split('#')[key.split('#').length - 1];

                    salesPersonList.forEach((elem: any) => {
                        if(elem.salesPersonId !== Number(empID)){
                            const targetDiv = document.getElementById('salesNote#' + elem.salesPersonId + '#taskId#' + taskID);
                            // @ts-ignore
                            targetDiv.hidden = true
                        }
                    })
                }else{
                    // @ts-ignore
                    if(textAreaDiv.hidden) { // @ts-ignore
                        textAreaDiv.hidden = false
                    }else{
                        // @ts-ignore
                        textAreaDiv.hidden = true
                    }
                }
            }

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

            return (
                <div className={"shadow-sm p-3"}>
                    <ToolsModule deptID={deptId} />
                    <Spacer y={5} />
                    <Table removeWrapper selectionMode={"none"} id={'tableInvoiceTaskItemsDeptId#' + deptId}>
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
                                <TableRow className={"taskRowDeptId#" + deptId} key={"taskId#" + object.id}
                                          id={"taskId#" + object.id}>
                                    <TableCell>
                                        <div className={'flex'}>
                                            <Popover placement="bottom" showArrow={true}>
                                                <PopoverTrigger>
                                                    <div>
                                                        <FaCircleInfo style={{ color: '#71717a'}} className={'hover:cursor-pointer'} />
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    {lastEditByMap.get("commRateTaskId#" + object.id)? (
                                                        <div className="px-1 py-2">
                                                            <div className="text-small font-bold pb-2">Last Edited By</div>
                                                            <div className="text-tiny">{lastEditByMap.get("commRateTaskId#" + object.id)}</div>
                                                        </div>
                                                    ): (
                                                        <div className="px-1 py-2">
                                                            <div className="text-small">
                                                                Not yet entered nor edited.
                                                            </div>
                                                        </div>
                                                    )}

                                                </PopoverContent>
                                            </Popover>
                                            <Spacer x={1} />
                                            {object.taskName}
                                        </div>

                                    </TableCell>
                                    <TableCell>{object.description}</TableCell>
                                    <TableCell className={"tableCellCommRate"}>
                                        <div className={"flex"}>
                                            <input id={"commRateTaskId#" + object.id}
                                                   autoComplete="off"
                                                   type={"text"}
                                                   maxLength={5}
                                                   className={"commRateInput w-[7ch] rounded pr-2 pl-2 text-center border-small border-default-200 dark:border-default-100"}
                                                   defaultValue={taskRateMap.get("commRateTaskId#" + object.id)} />
                                            <PiPercentLight className={"ml-1"} size={17} />
                                            <Spacer x={1} />
                                            <FaRegMessage onClick={() => showNote("commRateTaskNote#" + object.id)}
                                                          color={clsx({
                                                              ['#06b6d4']:taskNoteMap.get("commRateTaskId#" + object.id) !== undefined && taskNoteMap.get("commRateTaskId#" + object.id).length > 0
                                                          })}
                                                          className={"hover:cursor-pointer"}
                                            />
                                        </div>
                                        <Spacer y={1}/>
                                        <div id={"commRateTaskNote#" + object.id} hidden>
                                            <div className={"bg-[#f4f4f5] dark:bg-[#4a4a50] absolute z-10 rounded border-small border-default-200 dark:border-default-100 p-1 shadow-xl"}>
                                                <div className={"flex"}>
                                                    <IoClipboardSharp color={"#a8a8a8"} className={'mt-[2px]'} size={14} />
                                                    <Spacer x={1} />
                                                    <span className={"text-[#71717a] dark:text-[#9e9ea7] font-medium text-sm"}>{object.taskName}</span>
                                                </div>

                                                <textarea id={"textAreaTaskNote#" + object.id}
                                                          className={"text-[10pt] dark:bg-[#27272a] rounded border-small border-default-200 dark:border-default-100 p-2"}
                                                          defaultValue={taskNoteMap.get("commRateTaskId#" + object.id)}
                                                          maxLength={150}>
                                                </textarea>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/*@ts-ignore*/}
                                    {salesPersonList.map((sales: any, index: any) => (
                                        <TableCell
                                            className={"select-none"}
                                            key={index + "taskId#" + object.id + "#salesId#" + sales.salesPersonId}>
                                            <div className={"flex"}>
                                                <input id={"taskId#" + object.id + "#salesId#" + sales.salesPersonId}
                                                       autoComplete="off"
                                                       type={"text"} maxLength={5}
                                                       className={"w-[7ch] pr-2 pl-2 rounded text-center border-small border-default-200 dark:border-default-100"}
                                                       defaultValue={empAssignedRatesMap.get("taskId#" + object.id + "#salesId#" + sales.salesPersonId)} />
                                                <PiPercentLight className={"ml-1"} size={17} />
                                                <Spacer x={1} />
                                                <FaRegMessage
                                                    color={clsx({
                                                        ['#06b6d4']:salesNoteMap.get("taskId#" + object.id + "#salesId#" + sales.salesPersonId) !== undefined && salesNoteMap.get("taskId#" + object.id + "#salesId#" + sales.salesPersonId).length > 0 ,
                                                    })}
                                                    className={"hover:cursor-pointer"}
                                                    onClick={()=>showSalesNote("salesNote#" + sales.salesPersonId + "#taskId#" + object.id )}/>
                                            </div>
                                            <Spacer y={1}/>
                                            <div id={"salesNote#" + sales.salesPersonId + "#taskId#" + object.id} hidden={true}>
                                                <div className={"bg-[#f4f4f5] dark:bg-[#4a4a50] absolute z-10 rounded border-small border-default-200 dark:border-default-100 p-1 shadow-xl"}>
                                                    <div className={"flex"}>
                                                        <IoPerson color={"#a8a8a8"} className={'mt-[2px]'} size={14} />
                                                        <Spacer x={1} />
                                                        <span className={"text-[#71717a] dark:text-[#9e9ea7] font-medium text-sm"}>{sales.lastNameFirstName}</span>
                                                    </div>

                                                    <textarea
                                                        id={"textAreaSalesNote#" + sales.salesPersonId + "#taskId#" + object.id}
                                                        className={"text-[10pt] dark:bg-[#27272a] rounded border-small border-default-200 dark:border-default-100 p-2"}
                                                        defaultValue={salesNoteMap.get("taskId#" + object.id + "#salesId#" + sales.salesPersonId)}
                                                        rows={4} maxLength={150}>
                                                    </textarea>
                                                </div>
                                            </div>

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            );
        };

        const ViewSelectedCustomer = () => {

            return (
                <>
                    <span className={"pb-5 text-lg"}>
                        This configuration will apply to the following customer's assigned sales people.
                    </span>
                    <div className={"mb-5 w-[65%]"}>
                        <Table aria-label="Example static collection table">
                            <TableHeader>
                                <TableColumn>AR Number</TableColumn>
                                <TableColumn>Customer ID</TableColumn>
                                <TableColumn>Customer Name</TableColumn>
                                <TableColumn className={"min-w-[20ch]"}>
                                    <div className={"flex"}>
                                        <HiMiniUsers size={"19"} />
                                        <Spacer x={1} />
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
                                        {salesPersonList.length > 0 ?
                                            <ul>
                                                {salesPersonList.map((person: any, index: any) => (
                                                    <li key={index}>&#8226;{" " + person.lastNameFirstName}</li>
                                                ))}
                                            </ul> : <span className={"text-red-500"}>N/A</span>}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Spacer y={5} />
                    </div>
                </>
            );
        };

        return (
            <>
                <ViewSelectedCustomer />
                <div className={"pb-5"}>
                    <span className={"text-lg"}>
                        Select the invoice department to view their associated task items
                    </span>
                </div>
                <div className="task-dept-container flex flex-col">
                    <Accordion selectionMode="multiple" isCompact className={"w-full bg-[#fefdff] dark:bg-[#18181b]"}>
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
            <div
                className="w-full min-w-fit max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 h-fit sticky top-40">
                <Listbox className={"w-[100px]"}>
                    {selectedTaskItems.map((object, index) => (
                        <ListboxItem key={index}>{object}</ListboxItem>
                    ))}
                </Listbox>
                <Button onClick={CollectSelectedTaskItems}>Assign Commission Rates</Button>
            </div>
        );
    }

    // @ts-ignore
    return (
        <>
            <div className="flex mx-auto">
                <div className={"space-y-4 p-5 shadow-md h-fit rounded-small border-small border-default-200 dark:border-default-100"}>
                    <span>Search the customer by their AR number and click the customer you want to configure</span>
                    <Spacer y={1} />
                    <input
                        className={"w-full max-w-64 rounded-small border-small border-default-200 dark:border-default-100 bg-[#f4f4f5] text-center dark:bg-[#18181b]"}
                        placeholder={"Search by AR Number"}
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        id="series" />{" "}
                    <br />
                    {startFetching && <SearchResults keyword={searchTerm} url={props.url} />}
                </div>
                <Spacer x={14} />
                <div className={"rounded-small border-small border-default-200 dark:border-default-100 p-5 shadow-md"}>
                    {startFetchingTaskItems && <InvoiceTaskItems arNumber={arNumber} />}
                </div>
            </div>
        </>
    );
};
export default DisplayInvoiceTasksByDepartment;