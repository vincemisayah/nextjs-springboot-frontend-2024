import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const DisplayInvoiceList = ({invoiceList}:any)=>{
    return(
        <>
            <div className={'max-h-[60vh] overflow-y-auto'}>
                <Table removeWrapper isCompact={true}>
                    <TableHeader>{Object.keys(invoiceList[0]).map((headerName, index)=>(
                        <TableColumn key={index}>{headerName}</TableColumn>))}
                    </TableHeader>
                    <TableBody>{invoiceList.map((item: Object, index: number) => (
                        <TableRow key={index}>{Object.keys(item).map((key: string) => (
                            <TableCell key={key}>{item[key]}</TableCell>))}
                        </TableRow>))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
export default DisplayInvoiceList;