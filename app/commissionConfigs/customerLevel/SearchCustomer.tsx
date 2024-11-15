import React, { useState } from 'react';
import useSWR from 'swr';
import {Spacer} from "@nextui-org/react";
import {ScrollShadow} from "@nextui-org/scroll-shadow";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const SearchCustomer = (props: { url: any; }) => {
    const [startFetching, setStartFetching] = useState(false);
    const [startFetchingTaskItems, setStartFetchingTaskItems] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [arNumber, setArNumber] = useState("");

    const handleClick = (arNumber:string)=>{
        setStartFetchingTaskItems(true);
        setArNumber(arNumber);
    }

    const handleChange = (e: any) => {
        setStartFetchingTaskItems(false);
        setStartFetching(true);
        setSearchTerm(e.target.value);
    };


    const showTableBodyData = (object: Object) => {
        const tdData = [];
        let keyIndex = 0;
        for (const prop in object) {
            // @ts-ignore
            tdData.push(<td className={"pr-2 pl-2 text-sm antialiased"} key={++keyIndex}>{object[prop]}</td>);
        }
        return tdData;
    };

    // @ts-ignore
    const SearchResults = ({ url, keyword }) => {
        const { data, error } = useSWR(
            `${url + keyword}`,
            fetcher
        );

        if (error) return <div>failed to load</div>;
        if (!data) return <div>loading...</div>;
        if (!data[0]) return <div>not found</div>;

        const columnNames = new Set();
        for (const property in data[0])
            columnNames.add(<th className={"p-1 pr-2 pl-2"} key={property}>{property.toUpperCase()}</th>);

        return (
            <ScrollShadow className="h-[50vh]" >
                <table className={"customerListTable table-fixed"}>
                    <thead>
                    <tr className="border-b-2 border-slate-600">
                        {/*@ts-ignore*/}
                        {columnNames}
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((object: any, index: React.Key | null | undefined) => (
                        <tr onClick={( )=>handleClick(object.arNumber)}
                            key={index}
                            className="border border-slate-700 ...">
                            {showTableBodyData(object)}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </ScrollShadow>
        );
    };



    const InvoiceTaskItems = (arg: { arNumber: string })=>{
        const { data, error } = useSWR(
            process.env.NEXT_PUBLIC_BASE_URL + 'commissionConfigs/api/invoiceTasks',
            fetcher
        );

        console.log("InvoiceTaskItems data = ", data);

        if (error) return <div>failed to load</div>;
        if (!data) return <div>loading...</div>;
        if (!data[0]) return <div>not found</div>;

        return(
            <>
                <h1>AR NUMBER = {arg.arNumber}</h1>
                <table className={"table-fixed"}>
                    <thead>
                        <tr className="border-b-2 border-slate-600">
                            <th className="border-1 border-slate-600">Task ID</th>
                            <th className="border-1 border-slate-600">Task Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((object: any, index: React.Key | null | undefined) => (
                            <tr key={index} className={"border-1 border-slate-300"}>
                                <td className="border-1 border-slate-600">{object.id}</td>
                                <td className="border-1 border-slate-600">{object.name}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {/*<div className="border-2 border-slate-600">*/}
                {/*    <ol>*/}
                {/*        {data?.map((object: any, index: React.Key | null | undefined) => (*/}
                {/*            <li key={index} className={"border-1 border-slate-300"}>{object.name}</li>*/}
                {/*        ))}*/}
                {/*    </ol>*/}
                {/*</div>*/}


                {/*<h1>AR NUMBER = {arg.arNumber}</h1>*/}
                {/*<div className="border-2 border-slate-600">*/}
                {/*    <ol>*/}
                {/*        {data?.map((object: any, index: React.Key | null | undefined) => (*/}
                {/*            <li key={index} className={"border-1 border-slate-300"}>{object.name}</li>*/}
                {/*        ))}*/}
                {/*    </ol>*/}
                {/*</div>*/}
            </>
        )
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
                    <br/>
                    {startFetching && <SearchResults keyword={searchTerm} url={props.url}/>}
                </div>
                <Spacer x={14} />
                <div>
                    {startFetchingTaskItems && <InvoiceTaskItems arNumber={arNumber}/>}
                </div>
            </div>
        </>
    );
};
export default SearchCustomer;