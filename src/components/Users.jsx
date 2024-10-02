import { useEffect, useState } from "react"

import { useSearchParams } from "react-router-dom";
import { Topbarlogin } from "./Topbarlogin";
import { Sidebar } from "./Sidebar";
import { allitems } from "../store/atoms/allcards";
import { useRecoilState } from "recoil";
import { Optionbar } from "./OptionBar";
export function Users(){

    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");
    const [item, SetItem] = useRecoilState(allitems);
    //console.log(item);
    return <div>
        <div className="fixed top-0 left-0 right-0">
        {/* <Topbarlogin></Topbarlogin> */}
        {/* <Optionbar></Optionbar> */}
        </div>
        <div className="flex">
            
            {/* <Sidebar></Sidebar> */}
            {/* <div className="lg:ml-64 p-4">
                
            </div> */}
        </div>
        
            
    </div>
}
