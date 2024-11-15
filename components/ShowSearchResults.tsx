import React, { useState } from 'react';
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const showTableBodyData = (object:Object) =>{
    const tdData = [];
    let keyIndex = 0;
    for(const prop in object){
        // @ts-ignore
        tdData.push(<td className={'pr-2 pl-2 text-sm antialiased'} key={++keyIndex}>{object[prop]}</td> );
    }
    return tdData;
}

// @ts-ignore
const SearchResults = ({url, keyword }) => {
    const { data, error } = useSWR(
        `${url + keyword}`,
        fetcher
    );

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    if (!data[0]) return <div>not found</div>;

    const columnNames = new Set( );
    for(const property in data[0])
        columnNames.add(<th className={'p-1 pr-2 pl-2'} key={property}>{property.toUpperCase()}</th>);

    return(
        <div className={'searchListTableContainer text-sm max-w-prose ...'}>
            <table className={'searchListTable table-fixed'}>
                <thead>
                    <tr className="border-b-2 border-slate-600">
                        {/*@ts-ignore*/}
                        {columnNames}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((object: any, index: React.Key | null | undefined) => (
                        <tr key={index} className="border border-slate-700 ...">
                            {showTableBodyData(object)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ShowSearchResults = (props: { divWidth: string; url: any; }) => {
    const [startFetching, setStartFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e: any) => {
        setStartFetching(true);
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className={"space-y-4 " + props.divWidth}>
                <input className={'border-1 border-slate-600 w-full max-w-64'}
                       type="text"
                       value={searchTerm}
                       onChange={handleChange}
                       id="series" />{' '}
                <br />
                {startFetching && <SearchResults keyword={searchTerm} url={props.url}/>}
            </div>
        </>
    );
};
export default ShowSearchResults;