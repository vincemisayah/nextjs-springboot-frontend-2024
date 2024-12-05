import InvoiceLevelContent from "@/app/commissionConfigs/invoiceLevel/InvoiceLevelContent";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import useSWR from "swr";
import React from "react";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

// @ts-ignore
const ShowSearchResults = ({onInvoiceIdChange, searchInputValue}) => {
    const url = "http://localhost:1118/invoiceCommissionService/invoiceLevel/invoiceSearchResult?invoiceID="
    const { data:searchResult, error: searchResultError } = useSWR(
        `${url + searchInputValue}`,
        fetcher
    );

    const clickHandler = (invoiceID: number) => {
        const searchInvoiceContainer = document.getElementById('searchInvoiceContainer');
        // @ts-ignore
        searchInvoiceContainer.hidden = true;
        onInvoiceIdChange(invoiceID)
    }

    if(searchResult){
        return(
            <div id={'invoiceListContainer'} >

                <Table aria-label="Example static collection table" removeWrapper={true} selectionMode={'single'}>
                    <TableHeader>
                        <TableColumn>Invoice ID</TableColumn>
                        <TableColumn>Customer</TableColumn>
                        <TableColumn>Job ID</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1" onClick={()=>clickHandler(208072)} className={'hover:cursor-pointer'}>
                            <TableCell>208072</TableCell>
                            <TableCell>TEST Customer</TableCell>
                            <TableCell>43533</TableCell>
                        </TableRow>


                        {/*<TableRow key={"1"} onClick={()=>clickHandler(208072)} className={'hover:cursor-pointer'}>*/}
                        {/*    <TableCell>{searchResult.invoiceID}</TableCell>*/}
                        {/*    <TableCell>{searchResult.customerName}</TableCell>*/}
                        {/*    <TableCell>{searchResult.invoiceDate}</TableCell>*/}
                        {/*</TableRow>*/}
                    </TableBody>

                    {/*<TableBody>*/}
                    {/*    <TableRow key="1" onClick={()=>clickHandler(208072)} className={'hover:cursor-pointer'}>*/}
                    {/*        <TableCell>208072</TableCell>*/}
                    {/*        <TableCell>TEST Customer</TableCell>*/}
                    {/*        <TableCell>43533</TableCell>*/}
                    {/*    </TableRow>*/}
                    {/*</TableBody>*/}
                </Table>
            </div>
        )
    }else{
        return(
            <>
                <Spinner/>
            </>
        )
    }


    //
    // return(
    //     <div id={'invoiceListContainer'} >
    //
    //         <Table aria-label="Example static collection table" removeWrapper={true} selectionMode={'single'}>
    //             <TableHeader>
    //                 <TableColumn>Invoice ID</TableColumn>
    //                 <TableColumn>Customer</TableColumn>
    //                 <TableColumn>Job ID</TableColumn>
    //             </TableHeader>
    //             <TableBody>
    //                 <TableRow key="1" onClick={()=>clickHandler(208072)} className={'hover:cursor-pointer'}>
    //                     <TableCell>208072</TableCell>
    //                     <TableCell>TEST Customer</TableCell>
    //                     <TableCell>43533</TableCell>
    //                 </TableRow>
    //             </TableBody>
    //         </Table>
    //     </div>
    // )
}
export default ShowSearchResults;