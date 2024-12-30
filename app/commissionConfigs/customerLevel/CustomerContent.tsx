import DisplayInvoiceTasksByDepartment from "@/app/commissionConfigs/customerLevel/DisplayInvoiceTasksByDepartment";

export default function CustomerContent() {
    return (
        <>
            <main>
                <DisplayInvoiceTasksByDepartment url={`${process.env.NEXT_PUBLIC_BASE_URL}/commissionConfigs/customerLevel/api/customerListByAr`} />
            </main>
        </>
    );
}
