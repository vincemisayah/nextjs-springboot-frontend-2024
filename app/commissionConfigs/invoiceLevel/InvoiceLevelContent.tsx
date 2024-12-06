'use client'
import { SetStateAction, useEffect, useState } from "react";
import DisplayInvoice from "@/app/commissionConfigs/invoiceLevel/DisplayInvoice";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Spacer } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import ShowSearchResults from "@/app/commissionConfigs/invoiceLevel/ShowSearchResults";
import SearchInvoice from "@/app/commissionConfigs/invoiceLevel/SearchInvoice";


const InvoiceLevelContent = () => {
    const [targetInvoiceNumber, setTargetInvoiceNumber] = useState(0);



    const handleNameChange = (newInvoiceID: SetStateAction<number>) => {
        const changeInvoiceBtn = document.getElementById('changeInvoiceBtn');
        // @ts-ignore
        if(changeInvoiceBtn.hidden){
            changeInvoiceBtn.hidden = false;
        }

        setTargetInvoiceNumber(newInvoiceID);
    };

    return (
        <>
            <div className={'flex flex-row gap-4'}>
                {/*<div id={'searchInvoiceContainer'}  className={'border-1 rounded shadow-md text-center p-3 w-[20vw] min-w-fit'}>*/}
                <div id={'searchInvoiceContainer'}  className={'border-1 rounded shadow-md text-center p-3 w-[100%]'}>
                    {/*@ts-ignore*/}
                    208072
                    {/*<input id={'invoiceInputField'}*/}
                    {/*    size={12}*/}
                    {/*    type={'number'}*/}
                    {/*    className={'remove-arrow text-center border-small bg-gray-100 dark:bg-[#27272a] rounded'}*/}
                    {/*    placeholder={'Invoice Number'}*/}
                    {/*    onKeyDown={(e) => {*/}
                    {/*       if (e.key === "Enter")/!*@ts-ignore*!/*/}
                    {/*           setTargetInvoiceNumber(e.target.value);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*@ts-ignore*/}
                    {/*<Button onPress={(e) => setTargetInvoiceNumber(document.getElementById('invoiceInputField').value)}*/}
                    {/*    className={'ml-3 border-small shadow-sm'}*/}
                    {/*    size={'sm'}*/}
                    {/*    variant={'light'}>*/}
                    {/*    <FaMagnifyingGlass color={'#71717a'}/>*/}
                    {/*    Search*/}
                    {/*</Button>*/}
                    {/*<Spacer y={2}/>*/}
                    {/*<ShowSearchResults*/}
                    {/*    onInvoiceIdChange={handleNameChange}*/}
                    {/*    searchInputValue={targetInvoiceNumber}/>*/}

                    <SearchInvoice/>
                </div>

                <div>
                    <DisplayInvoice invoiceNumber={targetInvoiceNumber} />
                </div>

            </div>
        </>
    )
}
export default InvoiceLevelContent;