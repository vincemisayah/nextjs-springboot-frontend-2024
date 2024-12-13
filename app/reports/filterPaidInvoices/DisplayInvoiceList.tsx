import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

const DisplayInvoiceList = ({invoiceList}:any)=>{
    return(
        <>
            <div>
                <ScrollShadow className={'max-h-[60vh] overflow-y-auto'}>
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
                </ScrollShadow>
            </div>
        </>
    )
}
export default DisplayInvoiceList;