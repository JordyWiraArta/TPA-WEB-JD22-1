import { useQuery } from "@apollo/client"
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../lib/contexts/authContext";
import { fetchContext } from "../lib/contexts/fetchContext";
import { searchContext } from "../lib/contexts/searchContext";
import { GET_ALL_USERS } from "../lib/query"
import { GET_INVITATION } from "../lib/queryProfile";
import { ConnectModal } from "./ConnectModal";
import { LoadingText } from "./LoadingText";
import { BtnConnect } from "./ProfileButton";

export const Peoples: React.FC<{}> = ({})=>{

    const {loading, error, data} = useQuery(GET_ALL_USERS);
    const {search} = useContext(searchContext);
    const {id} = useContext(authContext);



    if(loading) return <LoadingText/>
    else return <div className="container bg" id="peoples-container">
       <p className="text" id="title">People</p>

       {data.users.map((user:any, index:number)=>{
            
            let username = user.first_name + " " + user.last_name;
            let valid = false;
            if(search !== ""){
                if(username.includes(search) || user.job.includes(search)) valid = true;
            } else {
                valid = true;
            }
        
            if(user.id === id) valid = false;
        
            if(valid) return <People user={user} username={username} currid={id}/>
       })}
       
    </div>
}

const People: React.FC<{user:any, username:string,currid:string}> = ({user,username, currid})=>{
    const [open, setOpen] = useState(false);
    const [valid, setValid] = useState(false);
    const [fetch, setFetch] = useState(false);
    const [sended, setSended] = useState(false);

    const {fetchs, setFetchs} = useContext(fetchContext);
    if(fetchs) {
        console.log("masuk");
        setFetch(true);
        setFetchs(false);
    }

    const {loading, data, error, refetch} = useQuery(GET_INVITATION,{
        variables:{
            userid: currid,
            dstid: user.id
        }
    })

    if(fetch){
        refetch();
    }

    if(!loading && data.userInvitations.length > 0 && sended == false) setSended(true);
    

    if(loading) return <div>loading..</div>
    return <div key={user.id}>
        <hr />
        <div className="flex" id="people">
            <div className="flex" id="left">
                <Link to={"/linkhedIn/profile/"+user.id}>
                {user.profile_photo === "" ? <img id="user-icon-peoples" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />: <img id="user-icon-peoples" src={user.profile_photo} alt="" />}
                </Link>
                
                <div className="data">
                    <p className="text" id="username">{username}</p>
                    <p className="text" id="job">{user.job === "" ? "not set" : user.job}</p>
                </div>
            </div>
            <BtnConnect setOpen={setOpen} userid={currid} selectedid={user.id} setValidMsg={setValid} sended={sended} fetch={fetch} setFetch={setFetch}/>
        </div>
        {open && <ConnectModal setOpen={setOpen} userid={currid} destid={user.id} setFetch={setFetch}/>}
    </div>
}