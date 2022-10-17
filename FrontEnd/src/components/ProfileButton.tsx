import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react";
import { Link } from "react-router-dom";
import { FOLLOW_USER, GET_CONNECTIONS, GET_FOLLOWED_USERS } from "../lib/queryProfile";

export const BtnFollow:React.FC<{userid:string, selectedid:string}> = ({userid, selectedid})=>{
    const {loading, error, data, refetch} = useQuery(GET_FOLLOWED_USERS, {variables:{
        userid: userid
    }});

    const [followUser] = useMutation(FOLLOW_USER);

    function handleFollow(){
        followUser({variables:{
            userid:userid,
            followid:selectedid
        }}).then(()=>{
            refetch()
        }).catch((err)=>{
            console.log(err);
        })
    }

    if(!loading){

        if(data.follows.length === 0) return <div className="btn text" id="follow" onClick={handleFollow}>
                                            follow
                                        </div>
        else return <div className="btn text" id="followed">
                    followed
                </div>

    } else return <div className="btn text" id="follow">
            loading.. 
        </div>
}

export const BtnConnect:React.FC<{userid:string, setValidMsg:Function, selectedid:string, setOpen:Function, sended:boolean, fetch:boolean, setFetch:Function}> = ({userid, setValidMsg, selectedid, setOpen, sended, fetch, setFetch}) =>{
    const {loading, data, error, refetch} = useQuery(GET_CONNECTIONS, {
        variables:{
            userid:userid
        }
    });

    const [valid, setValid] = useState(false);

    if(fetch){
        refetch();
        setFetch(false);
    }

    if(!loading){

        let connections = data.connects;
        if(data.connects.length >0){
            connections.forEach((e:any) => {
                
                if(e.user_id === selectedid && !valid){
                    setValid(true);
                } else if(e.connected_id === selectedid && !valid){
                    setValid(true);
                }
            });
        }

        
        if(valid){
        setValidMsg(true);
        return <div className="btn text" id="followed">
            connected
        </div>} else if(sended){
            return <div className="btn text" id="followed">
            sended
            </div>
        } else { 
            setValidMsg(false)
        return <div className="btn text" id="follow" onClick={()=> setOpen(true)}>
            connect
        </div>}

    } else return <div className="btn text" id="follow">
            loading.. 
        </div>
}

export const BtnMessage:React.FC<{valid:boolean}>= ({valid})=>{
    if(valid) return <Link className="btn text" id="follow" to="/linkhedIn/message">
            Message
        </Link>

    else return <div>

    </div>
}