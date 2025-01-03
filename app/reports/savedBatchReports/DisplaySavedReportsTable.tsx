import { FaFileDownload } from "react-icons/fa";

const DisplaySavedReportsTable = ({SavedBatchReports, Month}:any)=>{
    function openResponseInNewTab(response: Response) {
        // Convert response to Blob
        response.blob().then((blob: Blob | MediaSource) => {
            // Create a URL object from the Blob
            const url = URL.createObjectURL(blob);

            // Open the URL in a new tab
            window.open(url, '_blank');
        });
    }

    const downloadReport = async (date:string) => {
        const data = new URLSearchParams();
        data.set("passedDate", date);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/savedBatchReports/api/downloadCommissionReport?date=${date}`,{
            method: 'POST',
            body: data,
        });
        openResponseInNewTab(response);
    }

    return (
        <>
            <div className={'border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 ' +
                'w-fit max-h-[700px] overflow-y-auto p-5'}>
                <table className={'savedBatchReportTable'}>
                    <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Saved Report</th>
                    </tr>
                    </thead>
                    <tbody>
                    {SavedBatchReports[Month].map((item:any, index:number) => (
                        <tr key={index}>
                            {item.fileName.length > 0 ? (
                                <td className={"border-b-small border-default-200 dark:border-default-100 " +
                                    "pl-5 w-[170] text-start p-1.5 " +
                                    "bg-cyan-100 text-cyan-700 " +
                                    "dark:bg-cyan-900 dark:text-cyan-500"
                                }>
                                    {item.dateStr}
                                </td>
                            ):(
                                <td className={"border-b-small border-default-200 dark:border-default-100 " +
                                    "pl-5 w-[170] text-start p-1.5"}>
                                    {item.dateStr}
                                </td>
                            )}
                            {item.fileName.length > 0 ? (
                                <td className={"border-b-small border-default-200 dark:border-default-100  " +
                                    "w-[250] hover:cursor-pointer "  +
                                    "bg-cyan-100 text-cyan-700 hover:font-semibold "  +
                                    "dark:bg-cyan-900 dark:text-cyan-500"}>
                                    <div className={'flex items-center space-x-2 ml-5 my-1'}>
                                        <FaFileDownload className={"text-cyan-500"} />
                                        <span
                                            onClick={() => downloadReport(item.dateStr)}
                                              className={"text-cyan-500"}>
                                                                    {item.fileName}</span>
                                    </div>
                                </td>
                            ) : (
                                <td className={"border-b-small border-default-200 dark:border-default-100  " +
                                    "w-[250] text-center"}>
                                    <div className={"flex items-center space-x-2 p-1.5"}>
                                        <span
                                            // onClick={() => downloadReport(item.dateStr)}
                                              className={"text-cyan-500"}>
                                                                    {item.fileName}</span>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default DisplaySavedReportsTable;