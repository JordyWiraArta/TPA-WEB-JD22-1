import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { GET_CURR_USER } from "../query";

export const fetchContext = createContext<any>({});

export const FetchProvider: React.FC<{children:any}> = ({children}) => {
    
    // const [user, setUser] = useState(null);
        const [fetchs, setFetchs] = useState(false);
    
        return <fetchContext.Provider value={{fetchs: fetchs, setFetchs:setFetchs}}>
            {children}
        </fetchContext.Provider>

   

}

