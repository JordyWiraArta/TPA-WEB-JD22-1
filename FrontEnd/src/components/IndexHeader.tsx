import {Header} from "./Header"
import '../stylings/headers.scss'
import { useContext, useState } from "react"
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
    const {id} = useContext(authContext);
    const {search, setSearch} = useContext(searchContext);
    const navigateTo = useNavigate();
    const [logout, setLogOut] = useState(false);

    const [userid, setUserId] = useState("");
    var user = {
        background_photo:"",
        first_name:"",
        last_name:"",
        profile_photo: ""
    };
    const {loading, error, data, refetch} = useQuery(GET_CURR_USER, {
        variables:{
            id: id
        }
    });

    if(!loading){
        user = data.currUser;
    }

    const currPath = window.location.pathname;
    const arrPath = currPath.split("/");

    let toggleClass = "toggle-dark-light";
    if(width < 1300 && width > 800) {
        toggleClass = "toggle-dark-light-md";
    }
    else if(width < 800) {
        toggleClass = "toggle-dark-light-sm";
    }

    let username = "", imgUrl = "";

    if(localStorage.getItem('theme') !== null && currTheme !== JSON.parse(localStorage.getItem('theme')!)){
        setCurrTheme(JSON.parse(localStorage.getItem('theme')!));
    }  

    if(localStorage.getItem('userid') !== null && userid === ""){
        setUserId("ada");
    }  

    function setTheme(theme:String){
        localStorage.setItem('theme', JSON.stringify(theme));
    }

    if(id !== ""){
        username = user.first_name + " " + user.last_name;
        imgUrl = user.profile_photo;
    }

    if(arrPath[1] !== "linkhedIn"){
        
        if(userid !== "") {
            navigateTo("/linkhedIn/home");
        }

        if(currTheme === "dark"){
            document.body.style.backgroundColor = "#000000";
        } else {
            document.body.style.backgroundColor = "#FFFFFF";
        }

        return <div className="flex justify-between items-center">
            <Header logo={logo} width={width} theme={currTheme}/>
            <div className="items-center" onClick = {()=> currTheme === "light" ? setCurrTheme("dark") : setCurrTheme("light")}>
            {currTheme === "light" ?<Light setTheme={setTheme}/> : <Dark setTheme={setTheme}/>}

            </div>
        </div>
    } else {
        if(userid === ""){
            navigateTo("/");
        }

        if(currTheme === "dark"){
            document.body.style.backgroundColor = "#292929";
        } else {
            document.body.style.backgroundColor = "#f7f7f7";
        }

        return <div className={currTheme} >
            <div onClick={()=> {
                    if(currTheme === "light") {
                        setTheme("dark");
                        setCurrTheme("dark");
                    }
                    else {
                        setTheme("light");
                        setCurrTheme("light");
                    }
                }} className={toggleClass}>
                <p className="text" id="theme-text">{currTheme === "light" ? "light" : "dark"}</p>
                {currTheme === "light" ? <Light setTheme={()=>{}}/>: <Dark setTheme={()=>{}}/>}
            </div>
            <NavBar setSearch={setSearch} nav={arrPath[2]} width={width} username={username} setLogOut={setLogOut} imgUrl={imgUrl}/>
        </div> 
    }
}