import React from "react";
import useSWR from "swr";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Popover, PopoverContent, PopoverTrigger,
    Spinner, Switch,
    Tab,
    Tabs,
    useDisclosure
} from "@nextui-org/react";
import { IoInformationCircleSharp, IoPersonSharp } from "react-icons/io5";
import AssignTaskAndEmployeeRates from "@/app/commissionConfigs/invoiceLevel/AssignTaskAndEmployeeRates";
import { PiNoteBlank, PiNoteFill } from "react-icons/pi";
import ShowCustomerLevelConfig from "@/app/commissionConfigs/invoiceLevel/ShowCustomerLevelConfig";
import { TbEyeCog } from "react-icons/tb";
import { RxInfoCircled } from "react-icons/rx";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const ShowDistinctInvoiceTaskItems = ({customerId, invoiceNumber, distinctInvoiceTaskItems }) => {
    const { data: customerInfoWithSalesEmployeeList, error: customerInfoWithSalesEmployeeListError } = useSWR(invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerInfo?invoiceId=" + invoiceNumber:null,
        fetcher
    );

    const { data: customerJobInfo, error: customerJobInfoError } = useSWR(invoiceNumber > 0?
            "http://localhost:1118/invoiceCommissionService/customerlevel/customerAndJobInfo?invoiceId=" + invoiceNumber:null,
        fetcher
    );

    console.log('ShowDistinctInvoiceTaskItems, customerInfoWithSalesEmployeeList = ', customerInfoWithSalesEmployeeList);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const openModal = ( ) => {
        onOpen( );
    }

    const GetCustomerLevelTaskRate = (taskObj: any) => {
        const { data: customerLevelTaskRate, error: customerLevelTaskRateError } = useSWR(invoiceNumber > 0 ?
                "http://localhost:1118/invoiceCommissionService/customerlevel/taskRateInfo?customerID="+customerId
                +"&taskID=" +taskObj.taskID : null,
            fetcher
        );

        console.log('GetCustomerLevelTaskRate customerLevelTaskRate = ', customerLevelTaskRate);

        if(customerLevelTaskRateError){
            return (
                <span className={'text-red-500 dark:text-red-400'}>
                    Error: Failed to load data.
                </span>
            )
        }

        if(!customerLevelTaskRate){
            return (
                <span><Spinner color={'default'}/></span>
            )
        }

        return(
            <>
                <div>
                    <ul>
                        <li className="text-tiny">
                            <p className={"text-md font-bold pb-1"}>Customer-level Config</p>

                            <div>
                                {customerLevelTaskRate.notes.length > 0 ?
                                    (
                                        <>
                                            <Popover placement="bottom" showArrow={true}>
                                                <PopoverTrigger>
                                                    {/*<div>*/}
                                                        <u
                                                            className={"text-tiny hover:cursor-pointer"}>
                                                            Task Rate:{' '}{customerLevelTaskRate.commRate}%
                                                        </u>
                                                    {/*</div>*/}
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {/*<div className="text-small font-bold">Popover Content</div>*/}
                                                        <div className="text-tiny">{customerLevelTaskRate.notes}</div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </>
                                    ) : (
                                        <>
                                            <PiNoteBlank size={16} className={"ml-1 hover:cursor-pointer"} />
                                        </>
                                    )}
                            </div>
                        </li>
                        <li className="text-tiny">Fisher, Chris: 24%</li>
                        <li className="text-tiny">Hand, Donald: 34%</li>
                        <li className="text-tiny">House, Fisher: 21%</li>
                    </ul>
                    {/*<div className="text-tiny">This is the popover content</div>*/}
                </div>

                {/*<span>{customerLevelTaskRate.notes}</span>*/}
            </>
        );

    };

    return (
        <>
            <div
                className={"min-w-[50vw] p-4 m-3 shadow-md rounded-small border-small border-default-200 dark:border-default-100 dark:bg-[#3c3c3c]"}>
                <div className="space-y-1 mb-5">
                    <h4 className="text-medium font-medium">Configurable Invoice Task Items for Invoice
                        ID: {invoiceNumber}</h4>
                    <p className="text-small text-default-400">
                        Edit the task items' associated commission rates.
                    </p>
                </div>
                <table className={"min-w-full divide-y divide-gray-200 dark:divide-neutral-700"}>
                    <thead>
                    <tr>
                        <th scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Task
                            Name
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Description
                        </th>
                        {/*<th scope="col"*/}
                        {/*    className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Customer-level*/}
                        {/*    Rate*/}
                        {/*</th>*/}
                        <th scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Invoice-level
                            Rate
                        </th>
                        {(customerInfoWithSalesEmployeeList !== undefined) ? customerInfoWithSalesEmployeeList.salesPersonList.map((item, index) => (
                            <th key={index}
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                            >
                                {item.lastNameFirstName}
                            </th>
                        )) : null}
                        <th scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
                            Enable/Disable Config
                        </th>
                    </tr>
                    </thead>
                    <tbody className={"divide-y divide-gray-200 dark:divide-neutral-700"}>
                    {distinctInvoiceTaskItems?.map((taskItem: {
                        taskID: React.Key | null | undefined;
                    }, index: string) => (
                        <tr key={index}
                            // onClick={onOpen}
                            className={"border-b-small border-t-small dark:hover:bg-[#4f4f4f]"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <div className={'flex'}>
                                    <Popover placement="bottom" showArrow={true}>
                                        <PopoverTrigger>
                                            <div>
                                                <TbEyeCog size={18} className={'hover:cursor-pointer mr-2'} />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <GetCustomerLevelTaskRate taskID={taskItem.taskID} />
                                        </PopoverContent>
                                    </Popover>
                                    {taskItem.taskName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{taskItem.description}</td>
                            {/*<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">*/}
                            {/*    <GetCustomerLevelTaskRate taskID={taskItem.taskID} />*/}
                            {/*</td>*/}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <input id={"invoiceLevelCommRateInput#" + taskItem.taskID}
                                       type={"number"}
                                       className={"max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />
                            </td>

                            {(customerInfoWithSalesEmployeeList !== undefined) ? customerInfoWithSalesEmployeeList.salesPersonList.map((item, index) => (
                                <td key={index}
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    <input id={"invoiceLevelCommRateInput#" + taskItem.taskID}
                                           type={"number"}
                                           className={"max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />

                                </td>
                            )) : null}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <div className={'flex'}>
                                    <Popover placement="bottom" showArrow={true}>
                                        <PopoverTrigger>
                                            <div>
                                                <IoInformationCircleSharp size={17} className={'hover:cursor-pointer mr-0.5'}/>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="px-1 py-2">
                                                <div className="text-tiny">
                                                    If disabled, the program will resort to
                                                    <br/>using the customer-level configuration
                                                    <br/>assigned to this invoice task item.
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Switch  size={'sm'} color={'default'} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <ShowCustomerLevelConfig
                customerJobInfo={customerJobInfo}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                customerInfoWithSalesEmployeeList={customerInfoWithSalesEmployeeList} />

        </>
    );
};
export default ShowDistinctInvoiceTaskItems;