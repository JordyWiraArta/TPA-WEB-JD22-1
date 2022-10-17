import { useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../lib/contexts/authContext";
import { fetchContext } from "../../lib/contexts/fetchContext";
import { GET_CURR_USER } from "../../lib/query";
import { CREATE_NOTIF } from "../../lib/queryNotifMsg";
import { ADD_VIEWS } from "../../lib/queryProfile";

export const UserPostView: React.FC<{userid:String, type:string}> =  ({userid, type}) =>{
    const {loading, error, data, refetch} = useQuery(GET_CURR_USER, {
        variables:{
            id: userid
        }
    });

    const {id} = useContext(authContext);
    const navigateTo = useNavigate();
    const {setFetchs} = useContext(fetchContext);
    const [addNotif] = useMutation(CREATE_NOTIF)
    const [addViewNumber] = useMutation(ADD_VIEWS)
    const [show, setShow] = useState(false);

    let user:any = null;
    let profile = "";
    let job = "";

    if(!loading){
        user = data.currUser;
        
    
        profile = user.profile_photo;
        if(user.job === "")job = "unset Job";
        else job = user.job; 
    }
    if(loading) return <div>loading..</div>
    else {

    function handleview(){
        if(user.id === id){
            navigateTo("/linkhedIn/profile/my");
        } else {
            addViewNumber({
                variables:{
                    userid: user.id
                }
            }).then(()=>{
                setFetchs(true);
                addNotif({
                    variables:{
                        src_id: id,
                        content: "Has View " +  user.first_name + " profile"
                    }
                });
                navigateTo("/linkhedIn/profile/" + user.id)
            }).catch((err)=>{
                console.log(err);
            })
        }

    }
    
    return <div className="poster-container flex items-center">
        <label htmlFor="" className="profile-info">
            <div onClick={()=>handleview()}>
                {profile === "" ? <img onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)} id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />:
                <img onMouseEnter={()=>setShow(true)} onMouseLeave={()=> setShow(false)}  id="user-icon" src={user.profile_photo} alt="" />
                }
            </div>
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
                    <p className="text" id="label">Followers</p>
                    <p className="text" id="counter">{user.followers-1}</p>
                </div>
            </div>}

        </label>
        <div>    
            {type === "post" && <p className="text" id="poster-username">{user !== null ? user.first_name +" " + user.last_name : "Loading.."}</p>}
            {type === "comment" && <p className="text" id="commenter-username">{user !== null ? user.first_name +" " + user.last_name : "Loading.."}</p>}
            {type === "post" && <p className="text" id="grey">{user.followers-1 + " followers"}</p>}
            
        </div>

            
        </div>}
}