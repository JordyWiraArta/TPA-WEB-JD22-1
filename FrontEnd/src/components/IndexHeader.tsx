import {Header} from "./Header"
import '../stylings/headers.scss'
import { useContext } from "react"
import { ThemeContext, widthContext } from "../App"
import { Light } from "../lib/symbols/Light"
import { Dark } from "../lib/symbols/Dark"
// import { authContext } from "../lib/contexts/authContext"
import { NavBar } from "./NavBar"
import { searchContext } from "../lib/contexts/searchContext"
import { useNavigate } from "react-router-dom"
import { authContext } from "../lib/contexts/authContext"
import { useQuery } from "@apollo/client"
import { GET_CURR_USER } from "../lib/query"

export default function IndexHeader(){
    const {logo} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);
    const {currTheme, setCurrTheme} = useContext(ThemeContext);
    const {user, setUser} = useContext(authContext);
    const {search, setSearch} = useContext(searchContext);
    const navigateTo = useNavigate();
    
    const currPath = window.location.pathname;
    const arrPath = currPath.split("/");

    let toggleClass = "toggle-dark-light";
    if(width < 1300 && width > 800) {
        toggleClass = "toggle-dark-light-md";
    }
    else if(width < 800) {
        toggleClass = "toggle-dark-light-sm";
    }

    let userid = "";
    if(localStorage.getItem('userid') !== null){
        userid = JSON.parse(localStorage.getItem('userid'));
   }

   if(userid !== ""){
       
        const {loading, error, data} = useQuery(GET_CURR_USER, {
            variables:{
                id: userid
            }
        });
     
        if(data != undefined){
            setUser(data.currUser);
        }
    } 


    if(arrPath[1] !== "linkhedIn"){
        
        if(currTheme === "dark"){
            document.body.style.backgroundColor = "#000000";
        } else {
            document.body.style.backgroundColor = "#FFFFFF";
        }

        return <div className="flex justify-between items-center">
            <Header logo={logo} width={width} theme={currTheme}/>
            <div className="items-center">
            {currTheme === "light" ?<Light setTheme={setCurrTheme}/> : <Dark setTheme={setCurrTheme}/>}
            </div>
        </div>
    } else {
        if(userid === ""){
            navigateTo("/");
        }

        if(currTheme === "dark"){
            document.body.style.backgroundColor = "#292929";
        } else {
            document.body.style.backgroundColor = "#dadadb";
        }

        return <div className={currTheme} >
            <div onClick={()=> {
                if(currTheme === "light") setCurrTheme("dark");
                else setCurrTheme("light")
                }} className={toggleClass}>
                <p className="text" id="theme-text">{currTheme === "light" ? "light" : "dark"}</p>
                {currTheme === "light" ? <Light setTheme={()=>{}}/>: <Dark setTheme={()=>{}}/>}
            </div>
            <NavBar setSearch={setSearch} nav={arrPath[2]} width={width}/>
        </div> 
    }
}