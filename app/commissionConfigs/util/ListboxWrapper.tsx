import React from "react";
export const ListboxWrapper = ({children}: { children: React.ReactNode }) => (
    <div className="w-full max-w-[260px]  px-1 py-2">
        {children}
    </div>
);