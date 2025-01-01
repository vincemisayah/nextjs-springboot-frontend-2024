'use client'
import { SetStateAction, useState } from "react";
import DisplayInvoice from "@/app/commissionConfigs/invoiceLevel/DisplayInvoice";
import SearchInvoice from "@/app/commissionConfigs/invoiceLevel/SearchInvoice";


const InvoiceLevelContent = () => {
    const [targetInvoiceNumber, setTargetInvoiceNumber] = useState(0);

    const handleNameChange = (newInvoiceID: SetStateAction<number>) => {
        console.log('handleNameChange', newInvoiceID);
        const changeInvoiceBtn = document.getElementById('changeInvoiceBtn');
        if(changeInvoiceBtn !== null && changeInvoiceBtn.hidden){
            changeInvoiceBtn.hidden = false;
        }
        setTargetInvoiceNumber(newInvoiceID);
        const displayInvoiceContainer = document.getElementById('displayInvoiceContainer');
        // @ts-ignore
        displayInvoiceContainer.hidden = false;
    };

    return (
        <>
            <div className={'flex flex-row gap-5'}>
                <div id={'searchInvoiceContainer'}
                     className={'m-auto text-center border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 pr-5'}>
                    <SearchInvoice onInvoiceIdChange={handleNameChange} />
                </div>
                {/*{targetInvoiceNumber > 0 ? (*/}
                {/*    <div id={'displayInvoiceContainer'}>*/}
                {/*        <DisplayInvoice invoiceNumber={targetInvoiceNumber} />*/}
                {/*    </div>*/}
                {/*) : null}*/}

                {/*<div>*/}
                {/*    <DisplayInvoice invoiceNumber={targetInvoiceNumber} />*/}
                {/*</div>*/}

                <div id={'displayInvoiceContainer'}
                     className={'m-auto'}>
                    <DisplayInvoice invoiceNumber={targetInvoiceNumber} />
                </div>
            </div>
        </>
    )
}
export default InvoiceLevelContent;