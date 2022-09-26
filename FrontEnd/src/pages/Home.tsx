import { useQuery } from "@apollo/client"
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../App";
import { Posts } from "../components/Posts";
import { CreatePost } from "../components/Post Component/CreatePost";
import "../stylings/home.scss";
import { searchContext } from "../lib/contexts/searchContext";
import Search from "./Search";
import { authContext } from "../lib/contexts/authContext";
import { GET_CURR_USER } from "../lib/query";
import { Audio } from "react-loader-spinner";
import { CreatePostModal } from "../components/Post Component/CreatePostModal";

export default function Home(){

    const [open, setOpen] = useState(false);
    const [fetch, setFetch] = useState(false);
    const {currTheme} = useContext(ThemeContext);
    const {setIsSearch, isSearch} = useContext(searchContext);
    const {id} = useContext(authContext);
    var user = {
        background_photo:"",
        first_name:"",
        last_name:"",
        profile_photo: "",
        job: ""
    };
    const [bgImage, setBgImage] = useState("");
    const [load, setload] = useState(true);
    const {loading, error, data, refetch} = useQuery(GET_CURR_USER, {
        variables:{
            id: id
        }
    });

    let defaultBg = "https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg";

    if(!loading){
        user = data.currUser;
    }
    
    if(user !== null){
        if(bgImage === "" && user.background_photo !== "") {
            setBgImage(user.background_photo);
            setload(false);
        } else if(user.background_photo === "" && load === true){
            setload(false);
        }
    }

    if(!isSearch) {
        
    if(!loading) return <div className={currTheme} id="home-container">
        <div className="home-profile bg">
            <img id="background-img" src={bgImage === "" ? defaultBg : bgImage} alt="" />
            <div className="center-row">    
            {user.profile_photo === "" ? <img id="profile-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" /> : <img id="profile-photo" src={user.profile_photo} alt="" />}
            </div>

            <div className="profile-data center-all">
                <p className="text" id="username">{user === null ? "loading" : user.first_name + " " + user.last_name}</p>
                <p className="text" id="job">{user.job}</p>
            </div>

            <hr />

            <div className="connection-container">
                <p className="text" id="label">Connections</p>
                <p className="text" id="counter">10</p>
            </div>
        </div>
        <div className="home-post">
            <CreatePost user={user} setOpen={setOpen}/>
            <Posts isSearch={isSearch} fetch={fetch} setFetch={setFetch} user={user}/>
        </div>

        {open && <CreatePostModal setOpen={setOpen} user={user} setFetch={setFetch}/>}
    </div>
    else return <div className={currTheme} id="container">
            <p className="text" id="title">load</p>
            <Audio
            height="80"
            width="80"
            color="black"
            ariaLabel="loading"
            />
        </div>   
    } 

    else return <Search/>
}