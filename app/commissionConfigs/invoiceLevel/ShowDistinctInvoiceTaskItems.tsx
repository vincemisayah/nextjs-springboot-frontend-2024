import React from "react";
import useSWR from "swr";
import {Popover, PopoverContent, PopoverTrigger,Spinner, useDisclosure} from "@nextui-org/react";
import ShowCustomerLevelConfig from "@/app/commissionConfigs/invoiceLevel/ShowCustomerLevelConfig";
import { TbEyeCog } from "react-icons/tb";
import EnableDisableConfig from "@/app/commissionConfigs/invoiceLevel/EnableDisableConfig";
import { PiPercentLight } from "react-icons/pi";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
// @ts-ignore
const ShowDistinctInvoiceTaskItems = ({customerId, invoiceNumber, distinctInvoiceTaskItems}) => {
    const { data: customerInfoWithSalesEmployeeList, error: customerInfoWithSalesEmployeeListError } = useSWR(invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/customerInfo?invoiceId=${invoiceNumber}`:null,
        fetcher
    );

    const { data: customerJobInfo, error: customerJobInfoError } = useSWR(invoiceNumber > 0?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/customerAndJobInfo?invoiceId=${invoiceNumber}`:null,
        fetcher
    );
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    // @ts-ignore
    const GetSalespersonAssignedTaskRate = ({empID, taskID}) => {
        const { data: assignedRateInfo, error: assignedRateInfoError } = useSWR(invoiceNumber > 0 ?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/employeeAssignedRate?customerID=${customerId}&empID=${empID}&taskID=${taskID}`:null,
            fetcher
        );

        if(assignedRateInfoError){
            return (
                <span className={'text-red-500 dark:text-red-400'}>
                    Error: Failed to load data.
                </span>
            )
        }

        if(!assignedRateInfo){
            return (
                <span><Spinner color={'default'}/></span>
            )
        }

        return(
            <>
                <span>{assignedRateInfo.commRate}%</span>
            </>
        );
    }

    const GetCustomerLevelTaskRate = (taskObj: any) => {
        const { data: customerLevelTaskRate, error: customerLevelTaskRateError } = useSWR(invoiceNumber > 0 ?
            `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/taskRateInfoCustomerLevelConfig?customerID=${customerId}&taskID=${taskObj.taskID}`: null,
            fetcher
        );

        if(customerLevelTaskRateError){
            return (
                <span className={'text-red-500 dark:text-red-400'}>
                    Customer-level config not found.
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
                                                    <u className={"text-tiny hover:cursor-pointer"}>
                                                        Task Rate:{' '}{customerLevelTaskRate.commRate}%
                                                    </u>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        <div className="text-tiny">{customerLevelTaskRate.notes}</div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className={"text-tiny hover:cursor-pointer"}>
                                                Task Rate:{" "}{customerLevelTaskRate.commRate}%
                                            </span>
                                        </>
                                    )}
                            </div>
                        </li>

                        {customerInfoWithSalesEmployeeList.salesPersonList !== undefined ? customerInfoWithSalesEmployeeList.salesPersonList.map((elem: { lastNameFirstName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; salesPersonId: any; }, index: React.Key | null | undefined) => (
                            <li key={index} className="text-tiny">
                                {elem.lastNameFirstName}: {' '}
                                <GetSalespersonAssignedTaskRate empID={elem.salesPersonId} taskID={taskObj.taskID}/>
                            </li>
                        )):null}
                    </ul>
                </div>
            </>
        );

    };

    // @ts-ignore
    const DisplayTaskCommRate = ({taskItem}) =>{
        // @ts-ignore
        // `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/employeeAssignedRates?customerID=${invoiceNumber}&empID=${empID}&taskID=${taskItem.taskID}`
        const { data: invoiceTaskRateInfo, data:invoiceTaskRateInfoError } = useSWR(invoiceNumber > 0?
                `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/invoiceTaskRateInfo?invoiceID=${invoiceNumber}&taskID=${taskItem.taskID}`:null,
            fetcher
        );

        if(invoiceTaskRateInfo){
            return (
                <div className={'flex'}>
                    <input id={"invoiceLevelCommRateInput#" + taskItem.taskID}
                           defaultValue={invoiceTaskRateInfo.commRate}
                           type={"number"}
                           className={"max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />
                    <PiPercentLight className={'ml-1.5'}  size={19}/>
                </div>
            );
        }

        return (
            <div className={'flex'}>
                <input id={"invoiceLevelCommRateInput#" + taskItem.taskID}
                       type={"number"}
                       className={"max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />
                <PiPercentLight className={'ml-1.5'}  size={19}/>
            </div>
        );
    }

    // @ts-ignore
    const DisplayAssignedEmployeeCommRate = ({ taskItem, employeeId }) => {
        // @ts-ignore
        const { data: employeeCommRateInfo, data: employeeCommRateInfoError } = useSWR(invoiceNumber > 0 ?
                `${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/invoiceLevel/api/employeeAssignedRateInvoiceLevel?invoiceID=${invoiceNumber}&empID=${employeeId}&taskID=${taskItem.taskID}`:null,
            fetcher
        );

        if(employeeCommRateInfo){
            return (
                <div className={"flex"}>
                    <input id={"empCommRateEmpId#" + employeeId + '#taskId#' + taskItem.taskID}
                           defaultValue={employeeCommRateInfo.commRate}
                           type={"number"}
                           className={"empCommRateInputTaskId#"+taskItem.taskID+ " max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />
                    <PiPercentLight className={'ml-1.5'}  size={19}/>
                </div>

            );
        }

        return (
            <div className={'flex'}>
                <input id={"empCommRateEmpId#" + employeeId + '#taskId#' + taskItem.taskID}
                       type={"number"}
                       className={"empCommRateInputTaskId#"+taskItem.taskID+ " max-w-20 remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded "} />
                <PiPercentLight className={'ml-1.5'}  size={19}/>
            </div>

        );
    }

    // @ts-ignore
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
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Invoice-level
                            Rate
                        </th>
                        {/*@ts-ignore*/}
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
                    {distinctInvoiceTaskItems?.map((taskItem: {taskID: React.Key | null | undefined;}, index: string) => (
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
                                    {/*@ts-ignore*/}
                                    {taskItem.taskName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <DisplayTaskCommRate taskItem={taskItem}/>
                            </td>
                            {/*@ts-ignore*/}
                            {(customerInfoWithSalesEmployeeList !== undefined) ? customerInfoWithSalesEmployeeList.salesPersonList.map((item, index) => (
                                <td key={index}
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    <DisplayAssignedEmployeeCommRate taskItem={taskItem} employeeId={item.salesPersonId}/>
                                </td>
                            )) : null}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <div className={'flex'}>
                                    <EnableDisableConfig customerId={customerJobInfo.customerID}
                                        invoiceNumber={invoiceNumber}
                                        taskItem={taskItem}/>
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

    // return(
    //     <>
    //         ShowDistinctInvoiceTaskItems
    //     </>
    // )
};
export default ShowDistinctInvoiceTaskItems;