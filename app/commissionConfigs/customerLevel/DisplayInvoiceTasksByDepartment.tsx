import React, { useEffect, useRef, useState } from "react";
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
    const [loggedIn, setLoggedIn] = useState(-1);
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
    const [searchCustomerVisible, setSearchCustomerVisible] = useState(true);

    useEffect(() => {
        const userID = Number(window.localStorage.getItem("userID"));
        if(userID !== null)
            setLoggedIn(userID);
    }, [window.localStorage.getItem("userID")]);

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    const searchCustomerRef = useRef(null);

    const handleClick = (arNumber: string, customerId: number, customerName: string, salesPersonList: string[]) => {
        setStartFetchingTaskItems(true);
        setArNumber(arNumber);
        setCustomerId(customerId);
        setCustomerName(customerName);
        // @ts-ignore
        setSalesPersonList(salesPersonList);

        if(searchCustomerRef.current !== null){
            const targetDiv = searchCustomerRef.current; // @ts-ignore

            if(!targetDiv.hidden) // @ts-ignore
                targetDiv.hidden = true;
            else // @ts-ignore
                targetDiv.hidden = false;
            // @ts-ignore
            setSearchCustomerVisible(targetDiv.hidden);
        }

    };

    const handleChange = (e: any) => {
        setStartFetchingTaskItems(false);
        setStartFetching(true);
        setSearchTerm(e.target.value);
    };

    // @ts-ignore
    const SearchResults = ({ url, keyword }) => {
        const { data, error } = useSWR(
            `${url}?arNumber=${keyword}`,
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

    // @ts-ignore
    const ToolsModule = ({ deptID }) => {
        const postData = async (data: { taskId: undefined; taskRate: undefined; salesAssignedRates: never[]; }[])=>{
            while(true) {
                const saveBtn = document.getElementById('saveBtn#' + deptID);
                // @ts-ignore
                saveBtn.hidden = true;

                // setIsSaving(true);
                const spinnerDiv = document.getElementById('spinnerDivDeptId#' + deptID);
                // @ts-ignore
                spinnerDiv.hidden = false;

                // "spinnerDeptId#" + deptID
                const spinner = document.getElementById('spinnerDeptId#' + deptID);

                // @ts-ignore
                spinner.textContent = 'Saving changes . . . '

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/saveCustomerLevelConfig`,{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                })

                if(200 <= response.status || response.status < 300){
                    // @ts-ignore
                    saveBtn.hidden = false;
                    // @ts-ignore
                    spinnerDiv.hidden = true;
                    // @ts-ignore
                    spinner.style.color = '#19b9d4'
                    // @ts-ignore
                    spinner.textContent = 'Success!'

                    setTimeout(() => { // @ts-ignore
                        spinner.style.color = 'grey' // @ts-ignore
                        spinner.textContent = '' // @ts-ignore
                    }, "1500");

                    // router.refresh();
                    break;
                }else{ // @ts-ignore
                    saveBtn.hidden = false;
                    alert('Failed to save changes. Server response status: ' + response.status) // @ts-ignore
                    spinner.textContent = 'Save attempt failed'
                    setTimeout(() => {  // @ts-ignore
                        spinnerDiv.hidden = true; // @ts-ignore
                    }, "1500");
                    break;
                }
            }
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
                for(let i = TASK_COMM_RATE_COLUMN_INDEX; i < tdChildren.length-1; i++) {

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

        const fillTaskFields = ( ) =>{
            // @ts-ignore
            const valueInput = document.getElementById('toFillValueInputTaskCommRateDeptId#' + deptID).value;
            const table = document.getElementById('tableInvoiceTaskItemsDeptId#' + deptID);
            // @ts-ignore
            const tbody = Array.from(table.getElementsByTagName('tbody'))[0]
            const tRows =  Array.from(tbody.getElementsByTagName('tr'))
            tRows.forEach(row =>{
                const taskId = (row.id).split('#').at((row.id).split('#').length - 1);
                const inputTask = document.getElementById('commRateTaskId#' + taskId);
                // @ts-ignore
                inputTask.value = valueInput;
            })
        }

        return (
            <div>
                <Accordion motionProps={{
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
                                   title={<div className={'flex gap-2 text-[#71717a] hover:text-cyan-500 text-[12pt]'}><FaToolbox className={'mt-1.5'} size={15}/>Tools</div>}>
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
                                            type={"number"}
                                            maxLength={5}
                                            placeholder={'Rate %'}
                                            className={"remove-arrow text-center w-[8ch] pr-2 pl-2 border-small border-default-200 dark:border-default-100 rounded"} />
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
                                            type={"number"}
                                            maxLength={5}
                                            className={"remove-arrow w-[8ch] pr-2 pl-2 border-small border-default-200 dark:border-default-100 text-center rounded"} />
                                        <Spacer y={5} />
                                        <Button size={"sm"} onPress={fillTaskFields}>Fill in fields</Button>
                                    </div>
                                </div>
                                <div>
                                    <div id={'saveBtn#' + deptID} hidden={false}>
                                        <Button onPress={saveChanges}>Save Changes</Button>
                                    </div>


                                    <div className={"text-center pt-4 ml-5"}>
                                        <div id={"spinnerDivDeptId#" + deptID}
                                             hidden={true}>
                                            <Spinner color="default" />
                                        </div>
                                        {/*<br/>*/}
                                        <span className={'text-[#71717a] text-[11pt]'} id={"spinnerDeptId#" + deptID}></span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>


            </div>
        );
    };

    const InvoiceTaskItems = (arg: { arNumber: string }) => {
        const { data, error } = useSWR(
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/invoiceDepartmentList`,
            fetcher
        );

        if (error) return <div>failed to load</div>;
        if (!data) return <div><Spinner color={"default"} size={"lg"} /></div>;
        if (!data[0]) return <div>not found</div>;

        // @ts-ignore
        const DepartmentInvoiceTaskItems = ({ deptId }) => {
            const { data, error } = useSWR(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/invoiceTaskItemListByDeptId?deptId=${deptId}`,
                fetcher
            );

            const { data: taskRates, error: taskRatesError } = useSWR(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/taskCommissionRates?customerId=${customerId}`,
                fetcher
            );

            const { data: empAssignedRates, error: empAssignedRatesError } = useSWR(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/employeeAssignedRates?customerId=${customerId}`,
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

            const postDataSingleRow = async (deptID:any, data: { taskId: undefined; taskRate: undefined; salesAssignedRates: never[]; }[])=>{
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/saveCustomerLevelConfig`,{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                })

                if(200 <= response.status || response.status < 300){
                    return true;
                }else{ // @ts-ignore
                    return false;
                }
            }

            const saveSingleRowEdit = (deptId:any, rowIndex:any, tableRowId:any) =>{
                let arrayRateInfos: { taskId: undefined; taskRate: undefined; salesAssignedRates: never[]; }[] = [];
                const collectionOfRows = document.getElementsByClassName(tableRowId);
                const rows = Array.from(collectionOfRows);

                rows.forEach((row: any, index: any) => {
                    if(index === rowIndex){
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
                        for(let i = TASK_COMM_RATE_COLUMN_INDEX; i < tdChildren.length-1; i++) {
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
                    }

                })

                if(arrayRateInfos.length > 0){
                    const button = document.getElementById(`index#${rowIndex}#${tableRowId}#btn`); // @ts-ignore
                    button.disabled = true;

                    const buttonSave = document.getElementById(`index#${rowIndex}#${tableRowId}`);
                    // @ts-ignore
                    buttonSave.textContent = 'Saving';
                    // @ts-ignore
                    if(postDataSingleRow(deptId, arrayRateInfos)){
                        setTimeout(() => { // @ts-ignore
                            buttonSave.textContent = 'Success';
                            setTimeout(() => { // @ts-ignore
                                buttonSave.textContent = 'Save'; // @ts-ignore
                                button.disabled = false;
                            }, 2000);
                        }, 1000);


                    }else{
                        setTimeout(() => { // @ts-ignore
                            buttonSave.textContent = 'Failed';
                            setTimeout(() => { // @ts-ignore
                                buttonSave.textContent = 'Save'; // @ts-ignore
                                button.disabled = false;
                            }, 2000);
                        }, 1000);
                    }
                    // buttonSave.textContent = 'Save';
                }

            }


            // @ts-ignore
            return (
                <div className={"shadow-sm p-3"}>
                    <ToolsModule deptID={deptId} />
                    <Spacer y={5} />
                    <Table removeWrapper selectionMode={"none"} id={"tableInvoiceTaskItemsDeptId#" + deptId}>
                        <TableHeader>
                            <TableColumn>Task Name</TableColumn>
                            <TableColumn>Description</TableColumn>{/*@ts-ignore*/}
                            <TableColumn>Task Comm. Rate</TableColumn>{/*@ts-ignore*/}
                            {/*@ts-ignore*/}
                            {salesPersonList.map((name: any, index: any) => (
                                <TableColumn key={index}>{name.lastNameFirstName}</TableColumn>
                            ))}
                            <TableColumn>{''}</TableColumn>
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
                                            {/*@ts-ignore*/}
                                            <span className={'mr-2'}>{index+1}.</span>
                                            {object.taskName}
                                        </div>

                                    </TableCell>
                                    <TableCell>{object.description}</TableCell>
                                    <TableCell className={"tableCellCommRate"}>
                                        <div className={"flex"}>
                                            <input id={"commRateTaskId#" + object.id}
                                                   autoComplete="off"
                                                   type={"number"}
                                                   maxLength={5}
                                                   className={"remove-arrow commRateInput w-[7ch] rounded pr-2 pl-2 text-center border-small border-default-200 dark:border-default-100"}
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
                                    {/*@ts-ignore*/}
                                    </TableCell>{/*@ts-ignore*/}
                                    {/*@ts-ignore*/}
                                    {salesPersonList.map((sales: any, index: any) => (
                                        <TableCell
                                            className={"select-none"}
                                            key={index + "taskId#" + object.id + "#salesId#" + sales.salesPersonId}>
                                            <div className={"flex"}>
                                                <input id={"taskId#" + object.id + "#salesId#" + sales.salesPersonId}
                                                       autoComplete="off"
                                                       type={"number"} maxLength={5}
                                                       className={"remove-arrow w-[7ch] pr-2 pl-2 rounded text-center border-small border-default-200 dark:border-default-100"}
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

                                    {/*@ts-ignore*/}
                                    <TableCell>
                                        <button id={`index#${index}#taskRowDeptId#${deptId}#btn`}
                                            onClick={()=>saveSingleRowEdit(deptId, index,`taskRowDeptId#${deptId}`)}
                                            className={'dark:bg-[#27272a] dark:hover:bg-[#1e2122] bg-[#f4f4f5] hover:bg-[#e7e7e9] ' +
                                            'text-[9pt] border-small px-3 py-1 rounded-small border-default-200 dark:border-default-100'}>
                                            <span id={`index#${index}#taskRowDeptId#${deptId}`}>
                                                Save
                                            </span>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            );
        };

        const showSearchCustomer = ( ) =>{
            if(searchCustomerRef.current !== null){
                const targetDiv = searchCustomerRef.current; // @ts-ignore

                if(!targetDiv.hidden) // @ts-ignore
                    targetDiv.hidden = true;
                else // @ts-ignore
                    targetDiv.hidden = false; // @ts-ignore
                setSearchCustomerVisible(targetDiv.hidden);
            }
        }

        const ViewSelectedCustomer = () => {

            return (
                <>
                    {searchCustomerVisible?(
                        <>
                            <button onClick={showSearchCustomer}
                                    className={"border-small p-0.5 px-4 border-default-200 dark:border-default-100 rounded mb-3.5"}>Select
                                different customer
                            </button>
                        </>
                    ) : null}

                    <br />
                    <span className={"pb-5 text-lg"}>
                        This configuration will apply to the following customer and its assigned sales people
                    </span>
                    <Spacer y={3}/>
                    <div className={"mb-5 border-small px-1 py-2 border-default-200 dark:border-default-100 "}>
                        <Table shadow={"none"} fullWidth={true} radius={'none'} isCompact={true}>
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
            <div>
                <ViewSelectedCustomer />
                <div className={"pb-5"}>
                    <span className={"text-lg"}>
                        Select the invoice department to view and configure their associated invoice task items
                    </span>
                </div>
                <div className={"flex flex-col"}>
                    <Accordion selectionMode="multiple" isCompact className={"w-full dark:bg-[#18181b] bg-[#fefdff]"}>
                        {data?.map((object: any, index: React.Key | null | undefined) => (
                            <AccordionItem key={index} aria-label="Accordion 1"
                                           title={<span
                                               className={"font-bold text-lg text-cyan-700"}>{object.department}</span>}>
                                <DepartmentInvoiceTaskItems deptId={object.id} />
                            </AccordionItem>))}
                    </Accordion>
                </div>
            </div>
        );
    };

    // @ts-ignore
    return (
        <>
            <div className={"flex gap-5"}>
                <div hidden={false} ref={searchCustomerRef}
                    className={"space-y-4 p-5 shadow-md h-fit rounded-small border-small border-default-200 dark:border-default-100 h-fit sticky top-24"}>
                    <span>Search the customer by their AR number and click the customer you want to configure</span>
                    <Spacer y={1} />
                    <input
                        className={"remove-arrow w-full max-w-64 rounded-small border-small border-default-200 dark:border-default-100 bg-[#f4f4f5] text-center dark:bg-[#18181b]"}
                        placeholder={"Search by AR Number"}
                        type="number"
                        value={searchTerm}
                        onChange={handleChange}
                        id="series" />{" "}
                    <br />
                    {startFetching && <SearchResults keyword={searchTerm} url={props.url} />}
                </div>
                {/*className={"rounded-small border-small border-default-200 dark:border-default-100 p-5 bg-red-400"}*/}
                <div>
                    {startFetchingTaskItems && <InvoiceTaskItems arNumber={arNumber} />}
                </div>
            </div>
        </>
    );
};
export default DisplayInvoiceTasksByDepartment;