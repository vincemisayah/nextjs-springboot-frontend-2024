import SearchCustomer from "@/app/commissionConfigs/customerLevel/SearchCustomer";
import DisplayInvoiceTasksByDepartment from "@/app/commissionConfigs/customerLevel/DisplayInvoiceTasksByDepartment";


export default function CustomerContent() {
    return (
        <>
            <main>
                {/*<SearchCustomer*/}
                {/*    url={process.env.NEXT_PUBLIC_API_URL + 'fpAppserverService/invoiceCommission/customerListByAr?arNumber='} />*/}
                <DisplayInvoiceTasksByDepartment url={process.env.NEXT_PUBLIC_API_URL + 'fpAppserverService/invoiceCommission/customerListByAr?arNumber='}/>
            </main>
        </>
    );
}
