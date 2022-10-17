import { Search} from "../lib/symbols/Search"
import { ActiveHome,Home } from "../lib/symbols/Home"
import { ActiveJob, Job } from "../lib/symbols/Job"
import { ActiveNotif, Notif } from "../lib/symbols/Notif"
import { ActiveNetwork, Network } from "../lib/symbols/Network"
import { ActiveMessage, Message } from "../lib/symbols/Message"
import { DownArrow } from "../lib/symbols/Arrows"
import { Link, useNavigate } from "react-router-dom"
import { Profile } from "../lib/symbols/Profile"
import { useState } from "react"
import { useContext } from "react"
import { searchContext } from "../lib/contexts/searchContext"
import { authContext } from "../lib/contexts/authContext"

export const NavBar: React.FC<{ nav:string, setSearch: Function, width:number, username: String, setLogOut:Function, imgUrl:string}> = ({ nav, setSearch, width, username, setLogOut, imgUrl})=>{
    
    const navigateTo = useNavigate();
    const [show, setShow] = useState(false);
    const {setId} = useContext(authContext);

    let idNav = "nav-container";
    if(width < 1300 && width > 800) {
        idNav = "nav-container-md";
    }
    else if(width < 800) {
        idNav = "nav-container-sm";
    }

    const {setIsSearch} = useContext(searchContext);

    
    return <div className="bg" id={idNav}>
            <div className="left-container">

                <img onClick={()=> {
                    setIsSearch(false)
                    navigateTo("/linkhedIn/home");
                }} id="logo" src="https://www.edigitalagency.com.au/wp-content/uploads/new-linkedin-logo-white-black-png.png" alt="" />
                {width<800 && !show && <Search setShow={setShow} show={show}/>}
                {(width>800 || show) && <div id="searchBar">
                    <Search setShow={setShow} show={show}/>
                    <input onClick={()=>{setIsSearch(true)}} className="text" id="input" type="text" placeholder="search" onChange={(e)=>{
                        setSearch(e.target.value);
                    }} />
                </div>}
            </div>

            {!show && <div className="right-container">
                
                { nav === "home" ? 
                <div className="nav-btn" id="active">
                    <ActiveHome/>
                    {width > 800 && <p className="text" id="label">home</p>}
                </div> : <Link to="/linkhedIn/home" className="nav-btn" id="i-active">
                    <Home/>
                    {width > 800 && <p className="text" id="label">home</p>}
                </Link>}

                { nav === "network" ? 
                <div className="nav-btn" id="active">
                    <ActiveNetwork/>
                    {width > 800 && <p className="text" id="label">My Network</p>}
                </div> : <Link to="/linkhedIn/network" className="nav-btn" id="i-active">
                    <Network/>
                    {width > 800 && <p className="text" id="label">My Network</p>}
                </Link>}

                { nav === "job" ? 
                <div className="nav-btn" id="active">
                     <ActiveJob/> 
                     {width > 800 && <p className="text" id="label">Job</p>}
                </div> : <Link to="/linkhedIn/job" className="nav-btn" id="i-active">
                    <Job/>
                    {width > 800 && <p className="text" id="label">Job</p>}
                </Link>}

                { nav === "message" ? 
                <div className="nav-btn" id="active">
                    <ActiveMessage/>
                    {width > 800 && <p className="text" id="label">Messaging</p>}
                </div> : <Link to="/linkhedIn/message" className="nav-btn" id="i-active">
                    <Message/>
                    {width > 800 && <p className="text" id="label">Messaging</p>}
                </Link>}
                
                { nav === "notif" ? 
                <div className="nav-btn" id="active">
                     <ActiveNotif/>
                     {width > 800 && <p className="text" id="label">Notification</p>}
                </div> : <Link to="/linkhedIn/notif" className="nav-btn" id="i-active">
                    <Notif/>
                    {width > 800 && <p className="text" id="label">Notification</p>}
                </Link>}
                
                {width > 800 && <div className="dropdown">
                    <div className="center-row">
                        {imgUrl === ""? <Profile/>: <img className="nav-profile-photo" id="profile" src={imgUrl}/>}
                        <div className="center-row"> 
                            <p className="text" id="label">{username !== "" ? username : "Loading"}</p>
                            <DownArrow/>
                        </div>
                    </div>

                    <div className="content-box">
                        <div className="dropdown-content">
                            <div className="content-item" >
                                <Link className="text" id="view-profile" to="/linkhedIn/profile/my">
                                {width >1300 && "View Profile"}
                                {width <1300 && "Profile"}
                                </Link>
                            </div>
                            <div className="content-item" >
                                <button onClick={()=>{
                                    localStorage.removeItem("userid");
                                    navigateTo("/");
                                }} className="text" id="signout-btn">sign out</button>
                            </div>
                        </div>
                    </div>
                </div>}
                {
                    width<800 && <div className="dropdown-content center-all">
                        <div className="content-item" >
                            <Link className="text" id="view-profile" to="/linkhedIn/profile/my">
                            Profile
                            </Link>
                        </div>
                        <div className="content-item" >
                            <button onClick={()=>{
                                localStorage.removeItem("userid");
                                setId("");
                                setLogOut(true);
                                navigateTo("/");
                            }} className="text" id="signout-btn">sign out</button>
                        </div>
                    </div>
                }
            </div>}
        </div>
}