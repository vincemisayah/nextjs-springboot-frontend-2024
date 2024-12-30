import DisplayInvoiceTasksByDepartment from "@/app/commissionConfigs/customerLevel/DisplayInvoiceTasksByDepartment";

export default function CustomerContent() {
    return (
        <div className={'flex flex-row min-w-screen justify-center items-center'}>
            <DisplayInvoiceTasksByDepartment url={`${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/customerListByAr`} />
        </div>
    );
}
