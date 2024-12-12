import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const DisplayArrayOfObjectsAsTable = ({list}:any)=>{
    return(
        <>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    {Object.keys(list[0]).map((headerName, index)=>(
                        <TableColumn key={index}>{headerName}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {list.map((item: Object, index: number) => (
                        <TableRow key={index}>
                            {Object.keys(item).map((key: string) => (
                                <TableCell key={key}>{item[key]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
export default DisplayArrayOfObjectsAsTable;