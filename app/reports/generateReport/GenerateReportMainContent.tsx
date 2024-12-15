import { DateRangePicker, DateValue, Divider, RangeValue, Spacer } from "@nextui-org/react";
import {Listbox, ListboxItem} from "@nextui-org/react";
import { BsPersonFill } from "react-icons/bs";
import React, { useRef } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import { getLocalTimeZone, parseDate } from "@internationalized/date";

export default function GenerateReportMainContent() {
    const [dateValue, setDateValue] = React.useState<RangeValue<DateValue> | null>(null);
    let formatter1 = useDateFormatter({dateStyle:'long'});
    let formatter2 = useDateFormatter({dateStyle:'short'});
    // @ts-ignore
    const dateRangePickerRef = useRef<DateRangePicker>(null);

    function openResponseInNewTab(response) {
        // Convert response to Blob
        response.blob().then(blob => {
            // Create a URL object from the Blob
            const url = URL.createObjectURL(blob);

            // Open the URL in a new tab
            window.open(url, '_blank');
        });
    }

    const getInvoiceListByDateRange = async ( ) =>{
        console.log('getInvoiceListByDateRange . . . ');
        if(dateValue !== null){
            const startDate = formatter2.format(dateValue.start.toDate(getLocalTimeZone()));
            const endDate = formatter2.format(dateValue.end.toDate(getLocalTimeZone()));
            console.log("Date Start: ", startDate);
            console.log("Date End: ", endDate);

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
                <div className={'flex flex-row gap-5 border-t-small border-b-small p-3 border-default-200 dark:border-default-100'}>
                    <div>
                        {(dateValue === null)?(<span className={"text-md"}>Pick an invoice date-range</span>):null}
                        <DateRangePicker ref={dateRangePickerRef} label={"Invoice Date-Range"} visibleMonths={3}
                                         calendarWidth={256} labelPlacement={"inside"} size={"lg"}
                                         showMonthAndYearPickers={true}
                                         className={"max-w-xs mt-6 border-small border-gray-300 dark:border-none h-fit rounded-xl"}
                                         isRequired={true}
                                         // onChange={dateRangePickerOnChangeHandler}
                                         onChange={setDateValue}
                        />
                        <Spacer y={1}/>
                        {(dateValue !== null)?(
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
                                <Spacer y={2}/>
                                <button onClick={getInvoiceListByDateRange}
                                    className={'border-1 bg-[#d6e8fd] text-[#3369a9] rounded px-3 py-0.5'}>
                                    Search Invoice</button>

                            </div>
                        ) : null}
                    </div>

                    <div><Divider orientation="vertical" /></div>


                    {/*<Spacer x={20}/>*/}
                    {/*<div>*/}
                    {/*    <span className={'dark:bg-[#1e1f22] py-1 px-2 rounded'}>Choose Salesperson</span>*/}
                    {/*    <Listbox*/}
                    {/*        disallowEmptySelection*/}
                    {/*        aria-label="Single selection example"*/}
                    {/*        // selectedKeys={selectedKeys}*/}
                    {/*        selectionMode="single"*/}
                    {/*        variant="flat"*/}
                    {/*        // onSelectionChange={setSelectedKeys}*/}
                    {/*    >*/}
                    {/*        <ListboxItem key="1">*/}
                    {/*            <div className={"flex items-center space-x-2"}>*/}
                    {/*                <BsPersonFill />*/}
                    {/*                <span>Bill Woodlock</span>*/}
                    {/*            </div>*/}
                    {/*        </ListboxItem>*/}
                    {/*        <ListboxItem key="2">*/}
                    {/*            <div className={"flex items-center space-x-2"}>*/}
                    {/*                <BsPersonFill />*/}
                    {/*                <span>Chris Fischer</span>*/}
                    {/*            </div>*/}
                    {/*        </ListboxItem>*/}
                    {/*        <ListboxItem key="3">*/}
                    {/*            <div className={"flex items-center space-x-2"}>*/}
                    {/*                <BsPersonFill />*/}
                    {/*                <span>Thomas Scarpati Jr.</span>*/}
                    {/*            </div>*/}
                    {/*        </ListboxItem>*/}
                    {/*    </Listbox>*/}
                    {/*</div>*/}
                </div>

            </div>
        </main>
    );
}