import { useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { LoadingText } from "../components/LoadingText";
import { UserPostView } from "../components/Post Component/UserPostView";
import { authContext } from "../lib/contexts/authContext";
import { fetchContext } from "../lib/contexts/fetchContext";
import { CREATE_NOTIF } from "../lib/queryNotifMsg";
import { CONNECT_USER, GET_MY_INVITATION, REJECT_REQUEST } from "../lib/queryProfile";
import "../stylings/network.scss"

export default function MyNetwork(){

    const {currTheme} = useContext(ThemeContext);
    const {id} = useContext(authContext);
    const {setFetchs} = useContext(fetchContext);

    const {loading, data, error, refetch} = useQuery(GET_MY_INVITATION,
        {variables:{
            dstid: id
        }});
    
    const [addNotif] = useMutation(CREATE_NOTIF, {
        variables:{
            src_id: id,
            content: "Has Connected to a new friend!"
        }
    });

    const [acceptConnect] = useMutation(CONNECT_USER);
    const [rejectConnect] = useMutation(REJECT_REQUEST);

    function handleConnect (connectid:string){
        setFetchs(true);
        acceptConnect({variables:{
            userid: id,
            connectid: connectid,
        }}).then(()=>{
            addNotif();
            refetch();
        }).catch((err) =>{
            console.log(err);
        });
    }

    function handleReject (invId:string){
        rejectConnect({
            variables:{
                id:invId
            }
        }).then(()=>{
            refetch();
        }).catch((err)=>{
            console.log(err);
        })
    }

    if(loading) return <LoadingText/>
    else return <div className={currTheme} id="network-container">

        <div className="container bg">
            <p className="text" id="title">Network Request</p>
            {
                data.myInvitations.map((inv:any)=>{
                    return <div key={inv.id}>
                            <hr />
                            <div className="request-container">
                                <div>
                                    <UserPostView userid={inv.user_src_id} type="post"/>
                                </div>
                                <div className="flex">
                                    <div className="btn text" id="accept" onClick={()=>handleConnect(inv.user_src_id)}>
                                        Accept
                                    </div>
                                    <div className="btn text" id="reject" onClick={()=>handleReject(inv.id)}>
                                        Reject
                                    </div>
                                </div>

                            </div>
                            <div className="text" id="msg">
                                {inv.message}
                            </div>
                        </div>
                })
            }
            
        </div>
    </div>
}