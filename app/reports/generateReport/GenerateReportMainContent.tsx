import { DateRangePicker, DateValue, Divider, RangeValue, Spacer } from "@nextui-org/react";
import {Listbox, ListboxItem} from "@nextui-org/react";
import { BsPersonFill, BsSearch } from "react-icons/bs";
import React, { useEffect, useRef } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import DisplayFetchedInvoices from "@/app/reports/generateReport/DisplayFetchedInvoices";
import { FaRegFilePdf } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrStorage } from "react-icons/gr";
import { GoArchive } from "react-icons/go";

export default function GenerateReportMainContent() {
    const [dateValue, setDateValue] = React.useState<RangeValue<DateValue> | null>(null);
    const [paidInvoices, setPaidInvoices] = React.useState([]);
    const [assignedInvoices, setAssignedInvoices] = React.useState([]);

    useEffect(() => {

    }, [paidInvoices, assignedInvoices]);

    let formatter1 = useDateFormatter({dateStyle:'long'});
    let formatter2 = useDateFormatter({dateStyle:'short'});

    // @ts-ignore
    const dateRangePickerRef = useRef<DateRangePicker>(null);



    const getInvoiceListByDateRange = async ( ) =>{
        console.log('getInvoiceListByDateRange . . . ');
        if(dateValue !== null){
            const startDate = formatter2.format(dateValue.start.toDate(getLocalTimeZone()));
            const endDate = formatter2.format(dateValue.end.toDate(getLocalTimeZone()));

            let data = new FormData();
            // @ts-ignore
            data.append('startDate', startDate);
            data.append('endDate', endDate);

            await fetch('http://localhost:1118/invoiceCommissionService/report/v1/paidInvoices',{
                method: 'POST',
                body: data,
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Assuming the response is JSON
                // openResponseInNewTab(response);
                // console.log("response.json() = ", response.json());
            })
                .then(data => {
                    if(data !== undefined){
                        // @ts-ignore
                        console.log('data.PaidInvoices = ', data.PaidInvoices);
                        console.log("DATA = ", data);

                        // "PaidInvoices", viewablePaidInvoices,
                        // "SalespersonAssignedInvoices", salespersonAssignedInvoices));
                        setPaidInvoices(data.PaidInvoices);
                        setAssignedInvoices(data.SalespersonAssignedInvoices);
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
    }



    return (
        <main>
            <div>
                <div className={'mb-5'}>
                    <span className={"font-bold"}>Generate Report</span>
                    <p>Begin by selecting an invoice date-range to fetch fully-paid invoices saved in our database.</p>
                </div>
                <div
                    className={'flex flex-row gap-5 border-t-small border-b-small p-3 border-default-200 dark:border-default-100'}>
                    <div>
                        {(dateValue === null) ? (<span className={"text-md"}>Pick an invoice date-range</span>) : null}
                        <DateRangePicker ref={dateRangePickerRef} label={"Invoice Date-Range"} visibleMonths={3}
                                         calendarWidth={256} labelPlacement={"inside"} size={"lg"}
                                         showMonthAndYearPickers={true}
                                         className={"max-w-xs mt-6 border-small border-gray-300 dark:border-none h-fit rounded-xl"}
                                         isRequired={true}
                            // onChange={dateRangePickerOnChangeHandler}
                                         onChange={setDateValue}
                        />
                        <Spacer y={1} />
                        {(dateValue !== null) ? (
                            <div>
                                <p className="text-default-500 text-sm">
                                    Selected date:{" "}
                                    {dateValue
                                        ? formatter1.formatRange(
                                            dateValue.start.toDate(getLocalTimeZone()),
                                            dateValue.end.toDate(getLocalTimeZone())
                                        )
                                        : "--"}
                                </p>
                                <Spacer y={2} />

                                <button onClick={getInvoiceListByDateRange}
                                    className={"text-sm border-1 py-1 px-3 rounded-md bg-[#d6e8fd] text-[#4069af] border-[#3f84c7] " +
                                        "dark:bg-[#27272a] dark:border-[#818188] dark:text-[#818188]"}>
                                    <div className={"flex items-center space-x-2"}>
                                        <BsSearch />
                                        <span>Search Invoice</span>
                                    </div>
                                </button>

                            </div>
                        ) : null}
                    </div>
                    <div><Divider orientation="vertical" /></div>
                    <div>
                        {paidInvoices.length > 0 && assignedInvoices.length > 0? (
                            <div className={'mt-5'}>
                                <span className={'font-bold'}>Save to Batch Report Records</span>
                                <p>Save all sales employees calculated commission report to records.</p>
                                <Spacer y={3}/>
                                <button
                                    className={"text-sm border-1 py-1 px-3 rounded-md bg-[#d6e8fd] text-[#4069af] border-[#3f84c7] " +
                                        "dark:bg-[#27272a] dark:border-[#818188] dark:text-[#818188]"}>
                                    <div className={"flex items-center space-x-2"}>
                                        <GoArchive />
                                        <span>Save to Batch Report Records</span>
                                    </div>
                                </button>

                            </div>) : null}
                    </div>
                </div>
                <DisplayFetchedInvoices PaidInvoice={paidInvoices} SalespersonAssignedInvoices={assignedInvoices} />
            </div>
        </main>
    );
}