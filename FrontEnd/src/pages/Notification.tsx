import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { UserPostView } from "../components/Post Component/UserPostView";
import { authContext } from "../lib/contexts/authContext";
import { GET_MY_NOTIFICATION } from "../lib/queryNotifMsg";
import "../stylings/Notification.scss";

export default function Notification(){
    
    const {currTheme} = useContext(ThemeContext);
    const {id} = useContext(authContext);
    const {data, loading, error} = useQuery(GET_MY_NOTIFICATION,{
        variables:{
            user_id: id
        }
    });

    // if(!loading)console.log(data.myNotifications)
    if(!loading){
    let notifications = data.myNotifications;
    return <div className={currTheme} id="notif-container">
        <div className="text" id="title">
            Notification
        </div>
        {notifications.map((notif:any)=>{
            return <div>
                    <hr />
                    <div className="flex">
                    <UserPostView userid={notif.src_id} type="comment"/>
                    <div className="text" id="content">
                        {notif.content}
                    </div>
                </div>
                </div>
        })}
        
    </div>
    } else{
        return <div>
            loading..
        </div>
    }
}