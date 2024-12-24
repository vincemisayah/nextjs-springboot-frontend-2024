'use client'
import { SetStateAction, useState } from "react";
import DisplayInvoice from "@/app/commissionConfigs/invoiceLevel/DisplayInvoice";
import SearchInvoice from "@/app/commissionConfigs/invoiceLevel/SearchInvoice";


const InvoiceLevelContent = () => {
    const [targetInvoiceNumber, setTargetInvoiceNumber] = useState(0);

    const handleNameChange = (newInvoiceID: SetStateAction<number>) => {
        const changeInvoiceBtn = document.getElementById('changeInvoiceBtn');
        if(changeInvoiceBtn !== null && changeInvoiceBtn.hidden){
            changeInvoiceBtn.hidden = false;
        }
        setTargetInvoiceNumber(newInvoiceID);
    };

    return (
        <>
            <div className={'flex gap-4'}>
                <div id={'searchInvoiceContainer'}
                     className={'border-1 h-fit rounded shadow-md text-center p-3 w-[100%]'}>
                    <SearchInvoice onInvoiceIdChange={handleNameChange}/>
                </div>
                <div>
                    <DisplayInvoice invoiceNumber={targetInvoiceNumber} />
                </div>
            </div>
        </>
    )
}
export default InvoiceLevelContent;