import { Calendar, Spinner } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import useSWR from "swr";
import { IoDownloadOutline } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";
import DisplaySavedReportsTable from "@/app/reports/savedBatchReports/DisplaySavedReportsTable";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

export default function SavedBatchReports() {
    const getCurrentYear = () => {
        return new Date( ).getFullYear();
    }

    const { data: savedBatchReports, error: savedBatchReportsError } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/savedBatchReports/api/commissionReports`,
        fetcher
    );

    const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <main>
            <div>
                <div className={'pb-3'}>
                    <span className={'font-semibold text-lg'}>{getCurrentYear( )} Saved Commission Batch Reports</span>
                </div>
                <div className="flex flex-col gap-y-4">
                    {savedBatchReports !== undefined? (
                        <>
                            <Tabs variant={"light"}
                                  isVertical={false}>
                                {Months.map((month, index) => (
                                    <Tab key={month} title={month}>
                                        <DisplaySavedReportsTable Month={month} SavedBatchReports={savedBatchReports} />
                                    </Tab>
                                ))}
                            </Tabs>
                        </>
                    ):<Spinner size="lg" color={'primary'}/>}

                </div>
            </div>
        </main>
    );
}