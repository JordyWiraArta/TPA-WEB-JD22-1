import { useQuery } from "@apollo/client"
import { useContext, useState } from "react";
import { ThemeContext } from "../App";
import { Posts } from "../components/Posts";
import { CreatePost } from "../components/CreatePost";
import "../stylings/home.scss";
import { searchContext } from "../lib/contexts/searchContext";
import Search from "./Search";

export default function Home(){

    const {currTheme} = useContext(ThemeContext);
    const {setIsSearch, isSearch} = useContext(searchContext);

    if(!isSearch) return <div className={currTheme} id="home-container">
        <div className="home-profile bg">
            <img id="background-img" src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg" alt="" />
            <div className="center-row">

            
            <img id="user-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" />
            </div>

            <div className="profile-data center-all">
                <p className="text" id="username">Jordy Wira Arta</p>
                <p className="text" id="job">Student at Binus University</p>
            </div>

            <hr />

            <div className="connection-container">
                <p className="text" id="label">Connections</p>
                <p className="text" id="counter">10</p>
            </div>
        </div>
        <div className="home-post">
            <CreatePost/>
            <Posts isSearch={isSearch}/>
        </div>
    </div>

    else return <Search/>
}