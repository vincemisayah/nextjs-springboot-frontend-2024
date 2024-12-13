'use client'
import { Tabs, Tab, Card, CardBody, Divider } from "@nextui-org/react";
import { BsFilterSquare } from "react-icons/bs";
import { IoFilter } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import SavedBatchReports from "@/app/reports/savedBatchReports/SavedBatchReportMainContent";
import FilterPaidInvoicesMainContent from "@/app/reports/filterPaidInvoices/FilterPaidInvoicesMainContent";
import GenerateReportMainContent from "@/app/reports/generateReport/GenerateReportMainContent";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useState } from "react";

const ListboxWrapper = ({children}:any) => (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);

export default function BlogPage() {
    const [hideMainContent1, setHideMainContent1] = useState(false);
    const [hideMainContent2, setHideMainContent2] = useState(true);
    const [hideMainContent3, setHideMainContent3] = useState(true);

    const ShowContent = (key:any) =>{
        console.log("ShowContent key = ", key);
        setHideMainContent1(true);
        setHideMainContent2(true);
        setHideMainContent3(true);

        switch (key) {
            case 'savedBatchReport'  :setHideMainContent1(false); break;
            case 'filterPaidInvoices':setHideMainContent2(false); break;
            case 'generateReport'    :setHideMainContent3(false); break;
        }
    }

    return (
        <div className="flex w-full flex-col">
            <div className={"flex gap-10"}>
                <div className={"flex-none w-[14rem] h-fit"}>
                    <ListboxWrapper>
                        <Listbox aria-label="Actions"
                                 // selectionMode="single"
                                 variant="flat"
                                 color={'primary'}
                                 onAction={(key) => ShowContent(key)}
                        >
                            <ListboxItem key="savedBatchReport">
                                <div className="flex items-center space-x-2">
                                    <FaCalendarAlt />
                                    <span>Saved Batch Reports</span>
                                </div>
                            </ListboxItem>
                            <ListboxItem key="filterPaidInvoices">
                                <div className="flex items-center space-x-2">
                                    <IoFilter />
                                    <span>Filter Paid Invoices</span>
                                </div>
                            </ListboxItem>
                            <ListboxItem key="generateReport">
                                <div className="flex items-center space-x-2">
                                    <TbReportAnalytics />
                                    <span>Generate Report</span>
                                </div>
                            </ListboxItem>
                        </Listbox>
                    </ListboxWrapper>
                </div>
                <div><Divider orientation="vertical" /></div>

                <div className={"grow max-h-fit w-[70vw]"}>
                    <div id={'savedBatchReport'} hidden={hideMainContent1}><SavedBatchReports/></div>
                    <div id={'filterPaidInvoices'} hidden={hideMainContent2}><FilterPaidInvoicesMainContent /></div>
                    <div id={'generateReport'} hidden={hideMainContent3}><GenerateReportMainContent /></div>

                </div>

                {/*<div><Divider orientation="vertical" /></div>*/}
                {/*<div className={"border-1 border-slate-900 flex-none w-[7rem] h-fit"}>*/}
                {/*    03*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
