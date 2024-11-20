import InvoiceLevelContent from "@/app/commissionConfigs/invoiceLevel/InvoiceLevelContent";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

// @ts-ignore
const ShowSearchResults = ({onInvoiceIdChange}) => {
    const clickHandler = (invoiceID: number) => {
        console.log('INVOICE ID = ', invoiceID);
        onInvoiceIdChange(invoiceID)
    }

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
                </TableBody>
            </Table>
        </div>
    )
}
export default ShowSearchResults;