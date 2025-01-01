import React, { useState } from "react";

const SendAndSaveData = (props: { data: any; })=>{
    const [rateInfo, setRateInfo] = useState(props.data);

    return(
        <>
            <h1>
                HELLO WORLD!
            </h1>
        </>
    )
}
export default SendAndSaveData;