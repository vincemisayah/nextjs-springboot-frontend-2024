import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Spacer, Spinner } from "@nextui-org/react";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import { id } from "postcss-selector-parser";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FcBusinessman } from "react-icons/fc";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/modal";
import {
    Listbox,
    ListboxSection,
    ListboxItem
} from "@nextui-org/listbox";
import { HiCalculator } from "react-icons/hi";
import { HiMiniUserGroup, HiMiniUsers } from "react-icons/hi2";

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const DisplayInvoiceTasksByDepartment = (props: { url: any; }) => {
    const [startFetching, setStartFetching] = useState(false);
    const [startFetchingTaskItems, setStartFetchingTaskItems] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [arNumber, setArNumber] = useState("");
    const [customerId, setCustomerId] = useState(-1);
    const [customerName, setCustomerName] = useState("");
    const [selectedTaskItems, setSelectedTaskItems] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleClick = (arNumber: string, customerId:number, customerName:string) => {
        setStartFetchingTaskItems(true);
        setArNumber(arNumber);
        setCustomerId(customerId);
        setCustomerName(customerName);
    };

    const handleChange = (e: any) => {
        setStartFetchingTaskItems(false);
        setStartFetching(true);
        setSearchTerm(e.target.value);
    };


    const showTableBodyData = (object: Object) => {
        const tdData = [];
        let keyIndex = 0;
        for (const prop in object) {
            console.log(object[prop]);
            // @ts-ignore
            // tdData.push(<TableCell key={++keyIndex}>{object[prop]}</TableCell>);
        }
        return tdData;
    };

    // @ts-ignore
    const SearchResults = ({ url, keyword }) => {
        console.log("URL = ", url + keyword)
        const { data, error } = useSWR(
            `${url + keyword}`,
            fetcher
        );

        console.log("DATA = ", data);

        if (error) return <div>failed to load</div>;
        if (!data) return <Spinner color="default" size={'lg'}/>;
        if (!data[0]) return <div>not found</div>;


        return (
            <div className={'overflow-auto'}>
                <ScrollShadow className={"h-[50vh]"}hideScrollBar={true}>
                    <Table selectionMode={'single'} align={'left'}>
                        <TableHeader>
                            <TableColumn>Customer ID</TableColumn>
                            <TableColumn>Customer Name</TableColumn>
                            <TableColumn>AR</TableColumn>
                            <TableColumn className={'min-w-[20ch]'}>
                                <div className={'flex'}>
                                    <HiMiniUsers  size={'19'}/>
                                    <Spacer x={1}/>
                                    Sales
                                </div>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((object: any, index: React.Key | null | undefined) => (
                                // console.log("object = ", object)
                                <TableRow key={index} onClick={() => handleClick(object.arNumber, object.id, object.name)}>
                                    <TableCell>{object.id}</TableCell>
                                    <TableCell>{object.name}</TableCell>
                                    <TableCell>{object.arNumber}</TableCell>
                                    <TableCell>
                                        {object.salesPersonList.length > 0?
                                            <ul>
                                                {object.salesPersonList.map((name:any, index:any) =>(
                                                    <li key={index}>&#8226;{' ' + name.lastNameFirstName}</li>
                                                ))}
                                            </ul>: <span className={'text-red-500'}>N/A</span>}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollShadow>
            </div>
        );
    };


    const InvoiceTaskItems = (arg: { arNumber: string }) => {
        const { data, error } = useSWR(
            "http://localhost:1115/fpAppserverService/invoiceCommission/invoiceDepartmentList",
            fetcher
        );

        // console.log("InvoiceTaskItems data = ", data);

        if (error) return <div>failed to load</div>;
        if (!data) return <div>loading...</div>;
        if (!data[0]) return <div>not found</div>;

        const defaultContent =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

        // @ts-ignore
        const DepartmentInvoiceTaskitems = ({deptId})=>{
            const { data, error } = useSWR(
                'http://localhost:1115/fpAppserverService/invoiceCommission/invoiceTaskItemListByDeptId?deptId='+deptId,
                fetcher
            );

            if (error) return <div>failed to load</div>;
            if (!data) return <div>loading...</div>;
            if (!data[0]) return <div>not found</div>;

            // // console.log("DepartmentInvoiceTaskitems  data = ", data)
            // {
            //     "id": 91,
            //     "deptId": 1,
            //     "department": "Art",
            //     "taskName": "Coupon",
            //     "description": "Rate for Coupons"
            // },

            return(
                <div>
                    <Table color={"default"}
                           // selectionMode="multiple"
                           // aria-label="Example static collection table"
                           // onRowAction={(key) => alert(`Opening item ${key}...`)}
                           selectionMode="multiple"
                           removeWrapper
                        // selectionBehavior={'toggle'}
                    >
                        <TableHeader>
                            <TableColumn>Task Name</TableColumn>
                            <TableColumn>Description</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data?.map((object: any, index: React.Key | null) => (
                                <TableRow key={'taskId#' + object.id} id={'taskId#' + object.id} className={'taskRow'}>
                                    <TableCell>{object.taskName}</TableCell>
                                    <TableCell>{object.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                    {/*<table className="table-auto">*/}
                    {/*    <thead>*/}
                    {/*        <tr className={'table-row'}>*/}
                    {/*            <th>Task Name</th>*/}
                    {/*            <th>Description</th>*/}
                    {/*        </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {/*    {data?.map((object: any, index: React.Key | null) => (*/}
                    {/*        <tr key={index} id={'taskId#' + object.id} className={'table-row border-1'}>*/}
                    {/*            <td className={'pr-7'}>{object.taskName}</td>*/}
                    {/*            <td className={'pr-7'}>{object.description}</td>*/}
                    {/*        </tr>*/}
                    {/*    ))}*/}
                    {/*    </tbody>*/}
                    {/*</table>*/}
                </div>
            );
        }




        const ViewSelectedCustomer = () =>{

            return (
                <div className={"mb-5"}>
                    <h1>This configuration will apply to the following customer. To change the customer, simply search and click on the desired customer.</h1>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Customer Name</TableColumn>
                            <TableColumn>Customer ID</TableColumn>
                            <TableColumn>AR Number</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>{customerName}</TableCell>
                                <TableCell>{customerId}</TableCell>
                                <TableCell>{arNumber}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Spacer y={5}/>






                    {/*<Button onPress={onOpen}>Open Modal</Button>*/}
                </div>
            );
        }

        return (
            <>
                <ViewSelectedCustomer />
                <div className={"pb-5"}>
                    <span className={"text-1xl text-slate-700"}>
                        Select the invoice department to view their associated task items</span>
                </div>
                <div className="task-dept-container flex w-full flex-col">
                    <Accordion selectionMode="multiple" isCompact>
                        {data?.map((object: any, index: React.Key | null | undefined) => (
                            <AccordionItem key={index} aria-label="Accordion 1"
                                           title={<span
                                               className={"font-bold text-lg text-cyan-700"}>{object.department}</span>}>
                                <DepartmentInvoiceTaskitems deptId={object.id} />
                                {/*{defaultContent}*/}
                            </AccordionItem>))}
                    </Accordion>
                </div>
            </>
        );
    };

    function StickyDisplaySelectedTaskItems() {
        const foo = ( ) =>{
            console.log( "foo . . . " );
            const rows = document.getElementsByClassName("taskRow");

            if(selectedTaskItems.length > 0){
                selectedTaskItems.splice(0, selectedTaskItems.length)
            }
            for(let i = 0; i < rows.length; i++){
                if(rows[i].getAttribute("aria-selected") === 'true'){
                    // console.log(rows[i].id)
                    // @ts-ignore
                    selectedTaskItems.push(rows[i].id);
                }
            }
            // setSalesPersonList(arr);
            // if(selectedTaskItems.length > 0){
            onOpen( );
            // }


            // console.log( "selectedTaskItems  = ", selectedTaskItems);
        }

        return (
            <div className="w-full min-w-fit max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 h-fit sticky top-40">
                <Listbox className={'w-[100px]'}>
                    <ListboxItem key="new">New file</ListboxItem>
                    <ListboxItem key="copy">Copy link</ListboxItem>
                    <ListboxItem key="edit">Edit file</ListboxItem>
                    <ListboxItem key="delete" className="text-danger" color="danger">
                        Delete file
                    </ListboxItem>
                </Listbox>
                <Button onClick={foo} >Assign Commission Rates</Button>
            </div>
        );
    }

    // @ts-ignore
    return (
        <>
            <div className="flex">
                <div className={"space-y-4"}>
                    <input className={"border-1 border-slate-600 w-full max-w-64"}
                           type="text"
                           value={searchTerm}
                           onChange={handleChange}
                           id="series" />{" "}
                    <br />
                    {startFetching && <SearchResults keyword={searchTerm} url={props.url} />}
                </div>
                <Spacer x={14} />
                <div>
                    {startFetchingTaskItems && <InvoiceTaskItems arNumber={arNumber} />}
                </div>
                <Spacer x={5} />
                {startFetchingTaskItems &&  <StickyDisplaySelectedTaskItems/>}
            </div>









            <Modal
                size={'5xl'}
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                {selectedTaskItems?.map((object: any, index: React.Key | null | undefined) => (
                                    <div key={index}>{object}</div>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default DisplayInvoiceTasksByDepartment;