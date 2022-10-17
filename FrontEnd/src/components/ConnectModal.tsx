import { useMutation, useQuery } from "@apollo/client";
import { useContext, useRef, useState } from "react";
import { authContext } from "../lib/contexts/authContext";
import { fetchContext } from "../lib/contexts/fetchContext";
import { GET_CURR_USER } from "../lib/query";
import { CREATE_NOTIF } from "../lib/queryNotifMsg";
import { SEND_INVITATION } from "../lib/queryProfile";
import { Close } from "../lib/symbols/Close";

export const ConnectModal: React.FC<{setOpen:Function, userid:String, destid:String, setFetch:Function}> = ({setOpen, userid, destid, setFetch})=>{
    const [err, setErr] = useState("");
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const [sendInvitation] = useMutation(SEND_INVITATION);
    const {loading, data, error} = useQuery(GET_CURR_USER,{
        variables:{
            id: destid
        }
    })
    const [addNotif] = useMutation(CREATE_NOTIF);
    const {setFetchs} = useContext(fetchContext);

    function handleSendInvite(){
        let message = messageRef!.current?.value;

        if(message === ""){
            setErr("please fill all the blanks!");
            return;
        } else setErr("");
        
        sendInvitation({variables:{
            userid:userid,
            connectid:destid,
            message: message,
        }}).then(()=>{
            
            addNotif({variables:{
                src_id: userid,
                content: "Has send an invitation to " + data.currUser.first_name 
            }}).then(()=>{
                setFetchs(true);
                setFetch(true);
                setOpen(false);
            })
        }).catch((err)=>{
            console.log(err);
        })
    }

    return <div className="modal">
            <div className = "profile-modal bg">
                <div className="header">
                <p className="text" id="title">Add Experience</p>
                <Close setOpen={setOpen}/>
                </div>
                <hr />
                <div className='input-block'>
                    <p className='text' id="input-label">Your Message</p>
                    <textarea ref={messageRef} className='input-update text area' defaultValue={"Hai! Would you want to connect with me?"} placeholder="Your message.."/>
                </div>

                
                <div className="footer-modal">
                    <div id="btn-addnew" onClick={handleSendInvite}>
                        send
                    </div>
                </div>
                {err !== "" && <p className="text" id="errorMsg">{err}</p>}
            </div>
        </div>
}