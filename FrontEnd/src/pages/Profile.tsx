import { useContext, useEffect } from "react"
import { ThemeContext } from "../App"
import "../stylings/profile.scss";
import { Camera } from "../lib/symbols/ImageVid";
import { Edit } from "../lib/symbols/Edit";
import { authContext } from "../lib/contexts/authContext";
import { useState } from "react";
import { InputEducation, InputExperience, UpdateProfile } from "../components/Post Component/ProfileModal";
import { storage } from "../firebase";
import { ref, uploadBytes, deleteObject, getDownloadURL } from "@firebase/storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CURR_USER, UPDATE_BACKGROUND } from "../lib/query";
import { Audio } from "react-loader-spinner";
import { Education } from "../components/Education";
import { Experience } from "../components/Experience";
import { LoadingText } from "../components/LoadingText";
import { useParams } from "react-router-dom";
import { BtnConnect, BtnFollow, BtnMessage } from "../components/ProfileButton";
import { ConnectModal } from "../components/ConnectModal";
import { GET_INVITATION } from "../lib/queryProfile";
import { fetchContext } from "../lib/contexts/fetchContext";

export default function Profile (){

    const {currTheme} = useContext(ThemeContext);
    const {id} = useContext(authContext);
    const {otherid} = useParams<string>();
    const [fetch, setFetch] = useState(false);
    const [updEdu, setUpdEdu] = useState(null);
    const [updExp, setUpdExp] = useState(null);

    let userid;
    let authorizeEdit;
    let selectedid = "";
    if(otherid === "my") {
        authorizeEdit = true;
        userid = id;
    }
    else {
        selectedid=otherid;
        authorizeEdit = false;
        userid = otherid;
    }

    const {loading, error, data, refetch} = useQuery(GET_CURR_USER, {
        variables:{
            id: userid
        }
    });

    
    if(fetch ){
        refetch();
    }

    const [load, setLoad] = useState(false);
    var user = {
        id: "",
        background_photo:"",
        profile_photo: "",
        first_name:"",
        last_name:"",
        job: "",
        followers: 1,
        views: 1,
    };

    const [setBackground] = useMutation(UPDATE_BACKGROUND, {refetchQueries:[{query: GET_CURR_USER, variables:{id: id}}]});

    const [openEdu, setOpenEdu] = useState(false);
    const [openExp, setOpenExp] = useState(false);
    const [open, setOpen] = useState(false);
    const [connect, setConnect] = useState(false);
    const [validMsg, setValidMsg] = useState(false);
    const [sended, setSended] = useState(false);
    const [fetchConnection, setFetchConnection] = useState(false);

    const {fetchs, setFetchs} = useContext(fetchContext);
    if(fetchs) {
        setFetchConnection(true);
        setFetch(true);
        setFetchs(false);
    }



    let defaultBg = "https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg";

    if(!loading){
        user = data.currUser;
    }


    const uploadBgImage = (e:any) =>{
        let file = e.target.files![0];
        let extFile = file!.name.split(".");
        if( extFile[1] !== "jpg" && extFile[1] !== "jpeg" && extFile[1] !== "png" && extFile[1] !== "jfif") {
            alert("Please input image file .png, .jpg, .jpeg, or .jfif");
            return;
        }

        const alphabets = "abcdefghijklmnopqrstuvwxyz1234567890";
        let randUid = "";
        for(let i = 0; i<6; i++){
            let number = Math.round(Math.random()*36)
            randUid += alphabets[number];
        }

        setLoad(true);


        const imageRef = ref(storage, `images/${file!.name}${randUid}`);
        uploadBytes(imageRef, file!).then(()=>{
            
            getDownloadURL(imageRef).then((url) =>{
                
                setBackground({variables:{
                    id: id,
                    bg: url
                }}).then(() =>{
                    refetch().then(()=>setLoad(false));
                })
            })
            
        })
    }

    
    if(loading || load){
        return <LoadingText/>
    } else {

        console.log(user)
        return <div className={currTheme}>

        <div className="profile bg">
            {authorizeEdit && <label className="button-bg">
                <Camera/>
                <input id="file-input" type="file" onChange={(e) => {
                    uploadBgImage(e);
                }} /> 
            </label>}
            <img id="background-img" src={user.background_photo === "" ? defaultBg : user.background_photo} alt="" />
            <div className="">
                {authorizeEdit && <div className="button-edit" onClick={() => setOpen(true)}>
                    <Edit/>
                </div>}
                {user.profile_photo !== "" &&  <img id="profile-icon" src={user.profile_photo} alt="" />}
                {user.profile_photo === "" && <img id="user-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" />}
            </div>

            <div className="profile-data">
                <p className="text" id="username">{user === null ? "loading" : user.first_name + " " + user.last_name}</p>
                <p className="text" id="education">{user.job}</p>
                <p className="text" id="connection">{user.followers-1 + " Followers"}</p>
            </div>
            {!authorizeEdit &&
            <div className="useful-btn">
             <BtnFollow userid={id} selectedid={selectedid}/>   
             <ValidateConnectBtn dstid={selectedid} userid={id} setConnect={setConnect} setValidMsg={setValidMsg} sended={sended} setSended={setSended} fetch={fetchConnection} setFetch={setFetchConnection}/>
             <BtnMessage valid={validMsg}/>
            </div>}
            <div className="views">
                <p className="text" id="view-text">{"views " + (user.views - 1)}</p>
            </div>
        </div>

        <Education setOpen={setOpenEdu} id={userid} fetch={fetch} setFetch={setFetch} setUpd={setUpdEdu} edits={authorizeEdit}/>
        <Experience setOpen={setOpenExp} id={userid} fetch={fetch} setFetch={setFetch} setUpd={setUpdExp} edits={authorizeEdit}/>
        

        {authorizeEdit && openExp && <InputExperience setOpen={setOpenExp} setFetch={setFetch} userid={userid} upd={updExp} setUpd={setUpdExp}/>}
        {authorizeEdit && openEdu && <InputEducation setOpen={setOpenEdu} setFetch={setFetch} userid={userid} upd={updEdu} setUpd={setUpdEdu}/>}
        {authorizeEdit && open && <UpdateProfile user={user} setOpen={setOpen} setFetch={setFetch}/>}
        {connect && <ConnectModal setOpen={setConnect} userid={id} destid={selectedid} setFetch={setFetchConnection}/>}
    </div>}
    
}

const ValidateConnectBtn:React.FC<{dstid:string, userid:string, setConnect:Function, setValidMsg:Function, sended:boolean, setSended:Function, fetch: boolean, setFetch:Function}> = ({dstid, userid, setConnect, setValidMsg, sended, setSended, fetch, setFetch}) => {
    
    const {loading, data, error, refetch} = useQuery(GET_INVITATION, {
        variables:{
            dstid: dstid,
            userid: userid
        }
    });

    if(fetch) refetch();
    if(!loading && data.userInvitations.length > 0 && sended == false) setSended(true);

    return <BtnConnect userid={userid} setValidMsg={setValidMsg} selectedid={dstid} setOpen={setConnect} sended={sended} fetch={fetch} setFetch={setFetch}/>
}