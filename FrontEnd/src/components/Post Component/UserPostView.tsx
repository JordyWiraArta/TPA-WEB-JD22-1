import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_CURR_USER } from "../../lib/query";

export const UserPostView: React.FC<{userid:String}> =  ({userid}) =>{
    const {loading, error, data, refetch} = useQuery(GET_CURR_USER, {
        variables:{
            id: userid
        }
    });

    const [show, setShow] = useState(false);

    let user = null;
    let profile = "";
    let job = "";

    if(!loading){
        user = data.currUser;
        profile = user.profile_photo;
        if(user.job === "")job = "unset Job";
        else job = user.job; 
    }

    return <div className="poster-container flex items-center">
        <label htmlFor="" className="profile-info">
            {profile === "" ? <img onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)} id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />:
            <img onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}  id="user-icon" src={user.profile_photo} alt="" />
            }
            {show && <div className="additional-info">
                <div className="center-row">    
                {profile === "" ? <img id="user-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" /> : <img id="user-icon" src={user.profile_photo} alt="" />}
                </div>

                <div className="profile-data center-all">
                    <p className="text" id="username">{user === null ? "loading" : user.first_name + " " + user.last_name}</p>
                    <p className="text" id="job">{user === null ? "loading" : job}</p>
                </div>

                <hr />

                <div className="connection-container">
                    <p className="text" id="label">Connections</p>
                    <p className="text" id="counter">10</p>
                </div>
            </div>}

        </label>
        <div>    
            <p className="text" id="poster-username">{user !== null ? user.first_name +" " + user.last_name : "Loading.."}</p>
            <p className="text" id="grey">total follower</p>
            
        </div>

            
        </div>
}