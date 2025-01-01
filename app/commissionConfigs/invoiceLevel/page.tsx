import React from "react";
import InvoiceLevelContent from "@/app/commissionConfigs/invoiceLevel/InvoiceLevelContent";
import DisplayInvoice from "@/app/commissionConfigs/invoiceLevel/DisplayInvoice";


export default function CustomerLevelPage(){
    return(
        <section>
            {/*<h1>Invoice Level</h1>*/}
            <main>
                <div className={'border-5'}>
                    <InvoiceLevelContent/>
                </div>
            </main>
        </section>
    );
}