import { DateRangePicker, DateValue, Divider, RangeValue, Spacer, Spinner } from "@nextui-org/react";
import { BsSearch } from "react-icons/bs";
import React, { useEffect, useRef } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import { getLocalTimeZone } from "@internationalized/date";
import DisplayFetchedInvoices from "@/app/reports/generateReport/DisplayFetchedInvoices";
import { GoArchive } from "react-icons/go";
import TestFile1 from "@/app/reports/filterPaidInvoices/backup/testFile1";

export default function GenerateReportMainContent() {
    const [dateValue, setDateValue] = React.useState<RangeValue<DateValue> | null>(null);
    const [paidInvoices, setPaidInvoices] = React.useState([]);
    const [assignedInvoices, setAssignedInvoices] = React.useState([]);
    const [savingBatchCommissionReport, setSavingBatchCommissionReport] = React.useState(false);
    const [showSaveAttemptSuccessStatus, setShowSaveAttemptSuccessStatus] = React.useState(false);
    const [showSaveAttemptFailedStatus, setShowSaveAttemptFailedStatus] = React.useState(false);

    useEffect(() => {

    }, [paidInvoices, assignedInvoices]);

    let formatter1 = useDateFormatter({dateStyle:'long'});
    let formatter2 = useDateFormatter({dateStyle:'short'});

    // @ts-ignore
    const dateRangePickerRef = useRef<DateRangePicker>(null);



    const getInvoiceListByDateRange = async ( ) =>{
        if(dateValue !== null){
            const startDate = formatter2.format(dateValue.start.toDate(getLocalTimeZone()));
            const endDate = formatter2.format(dateValue.end.toDate(getLocalTimeZone()));
            let data = new URLSearchParams();
            // @ts-ignore
            data.append('startDate', startDate);
            data.append('endDate', endDate);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/generateReport/api/paidInvoices`,{
                method: 'POST',
                body: data,
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then(data => {
                    if(data !== undefined){
                        setPaidInvoices(data.PaidInvoices);
                        setAssignedInvoices(data.SalespersonAssignedInvoices);
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
    }

    const saveToBatchReportRecords = async ( ) =>{
        if(dateValue !== null){
            const startDate = formatter2.format(dateValue.start.toDate(getLocalTimeZone()));
            const endDate = formatter2.format(dateValue.end.toDate(getLocalTimeZone()));

            let data = new URLSearchParams();
            // @ts-ignore
            data.append('startDate', startDate);
            data.append('endDate', endDate);

            setSavingBatchCommissionReport(true);

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/generateReport/api/saveToRecords`,{
                method: 'POST',
                body: data,
            }).then(response => {
                setSavingBatchCommissionReport(false);
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    setShowSaveAttemptFailedStatus(true);
                    setTimeout(() => {
                        setShowSaveAttemptFailedStatus(false);
                    }, 2500);
                }else{
                    setShowSaveAttemptSuccessStatus(true);
                    setTimeout(() => {
                        setShowSaveAttemptSuccessStatus(false);
                    }, 2500);

                }
                return response.json(); // Assuming the response is JSON
            })
                .then(data => {

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
                        {paidInvoices.length > 0 && assignedInvoices.length > 0 ? (
                            <div className={'mt-5'}>
                                <span className={'font-bold'}>Save to Batch Report Records</span>
                                <p>Save all sales employees calculated commission report to records.</p>
                                <Spacer y={3} />
                                {savingBatchCommissionReport ? (
                                    <button
                                        disabled={true}
                                        className={"text-sm border-1 py-1 px-3 rounded-md bg-[#eef6ff] text-[#688cca] border-[#3f84c7] " +
                                            "dark:bg-[#27272a] dark:border-[#818188] dark:text-[#818188]"}>
                                        <div className={"flex items-center space-x-2"}>
                                            <Spinner size="sm" />
                                            <span>Saving Report . . . </span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={saveToBatchReportRecords}
                                        className={"text-sm border-1 py-1 px-3 rounded-md bg-[#d6e8fd] text-[#4069af] border-[#3f84c7] " +
                                            "dark:bg-[#27272a] dark:border-[#818188] dark:text-[#818188]"}>
                                        <div className={"flex items-center space-x-2"}>
                                            <GoArchive />
                                            <span>Save to Batch Report Records</span>
                                        </div>
                                    </button>
                                )}


                            </div>) : null}

                        {showSaveAttemptSuccessStatus ? (
                            <div className={'bg-green-100 w-fit p-2 m-2 rounded'}>
                                <span className={'text-green-800'}>
                                    Commission Batch Report saved successfully!
                                </span>
                            </div>
                        ) : null}

                        {showSaveAttemptFailedStatus ? (
                            <div className={'bg-red-100 w-fit p-2 m-2 rounded'}>
                                <span className={'text-red-800'}>
                                    Commission Batch Report failed to save
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
                <DisplayFetchedInvoices PaidInvoice={paidInvoices} SalespersonAssignedInvoices={assignedInvoices} />
            </div>
        </main>
    );
}