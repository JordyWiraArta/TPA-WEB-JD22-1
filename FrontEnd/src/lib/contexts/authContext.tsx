import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { GET_CURR_USER } from "../query";

export const authContext = createContext<any>({});

export const AuthProvider: React.FC<{children:any}> = ({children}) => {
    
    // const [user, setUser] = useState(null);
    const [id, setId] = useState("");

    
    useEffect(()=>{
        if(localStorage.getItem('userid') !== null && id === ""){
            setId(JSON.parse(localStorage.getItem('userid')!));
        }
        if(localStorage.getItem('userid') === null && id !== ""){
            setId("");
        }

    }, [id])
    
        return <authContext.Provider value={{setId,id:id}}>
            {children}
        </authContext.Provider>

   

}

