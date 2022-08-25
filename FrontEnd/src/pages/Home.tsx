import { useQuery } from "@apollo/client"
import { useContext, useState } from "react";
import { ThemeContext } from "../App";
import { GET_ALL_USERS } from "../lib/query"

export default function Home(){
    const {loading, data} = useQuery(GET_ALL_USERS);
    
    const {currTheme, setCurrTheme} = useContext(ThemeContext);

    if(loading){
        return <div>
            loading..
        </div>
    } else {
        console.log(data)
        return( <div className={currTheme}>
        <div className="bg" onClick={()=> {
            if(currTheme == "light") setCurrTheme("dark")
            else setCurrTheme("light")}}>
            <p className="text">{currTheme}</p>
        </div>
    </div>)
    }
}