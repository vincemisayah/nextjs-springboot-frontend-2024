import React, { useState } from "react";
import useSWR from "swr";
import { Spacer, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const SearchInvoice = ({onInvoiceIdChange}:any) =>{
    const [searchInput, setSearchInput] = useState('');

    // @ts-ignore
    const { data: searchResult, error: searchResultError } = useSWR(searchInput > 0?
            "http://localhost:1118/invoiceCommissionService/invoiceLevel/searchInvoiceById?invoiceID=" + searchInput:null,
        fetcher
    );

    const clickHandler = (invoiceID: number) => {
        const searchInvoiceContainer = document.getElementById('searchInvoiceContainer');
        // @ts-ignore
        searchInvoiceContainer.hidden = true;
        onInvoiceIdChange(invoiceID)
    }

    return(
        <>
            {/*<div>*/}
                Search Invoice
                <Spacer y={1}/>
                <input className={'text-center bg-gray-200 dark:bg-gray-700 dark:border-gray-300'}
                    placeholder={208072}
                    type={'number'}
                    onChange={(e) => setSearchInput(e.target.value)}/>
                {/*<br/>*/}
            {/*</div>*/}
            <Spacer y={4}/>
            <div className={"m-auto w-[30vw] max-h-[50vh] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 overflow-y-auto"}>
                <Table removeWrapper={true}
                       selectionMode={'single'}
                       isCompact
                       isHeaderSticky
                       isStriped
                       fullWidth
                       radius={'none'}
                >
                    <TableHeader>
                        <TableColumn>Invoice ID</TableColumn>
                        <TableColumn>Customer</TableColumn>
                        <TableColumn>Job ID</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {searchResult !== undefined && searchResult.length > 0? searchResult.map((obj:Object, index:any)=>(
                                <TableRow key={index}
                                          onClick={()=>clickHandler(obj.invoiceID)}
                                          className={'hover:cursor-pointer'}>
                                    <TableCell>{obj.invoiceID}</TableCell>
                                    <TableCell>{obj.customerName}</TableCell>
                                    <TableCell>{obj.jobID}</TableCell>
                                </TableRow>
                        )) : null}

                    </TableBody>
                </Table>
            </div>
        </>
    )
}
export default SearchInvoice;