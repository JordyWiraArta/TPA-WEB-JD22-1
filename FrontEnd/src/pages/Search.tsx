import { useState } from "react";
import { useContext } from "react"
import { ThemeContext } from "../App"
import { Peoples } from "../components/Peoples";
import { Posts } from "../components/Posts";
import { searchContext } from "../lib/contexts/searchContext";
import '../stylings/search.scss';

export default function Search(){
    
    const {currTheme} = useContext(ThemeContext);
    const [filter, setFilter] = useState("");
    const {isSearch} = useContext(searchContext);

    return <div className={currTheme}>
        <div className="filter bg">
            <p className="text" id="title">Filter:</p>
            <div onClick={()=> setFilter("")} className={filter === "" ? "btn-filter active": "btn-filter"}>
                All
            </div>
            <div onClick={()=> setFilter("people")} className={filter === "people"? "btn-filter active": "btn-filter"}>
                People
            </div>
            <div onClick={()=> setFilter("post")} className={filter === "post"? "btn-filter active": "btn-filter"}>
                Post
            </div>
        </div>
        {filter === "" && <div className="container-search">
            <Peoples/>
            <div className="search-post">
                <Posts isSearch ={isSearch}/>
            </div>
        </div>}

        {filter === "people" && <div className="container-search">
                <Peoples/>
            </div>}

        {filter === "post" && <div className="container-search">
                <div className="search-post">
                    <Posts isSearch={isSearch}/>
                </div>
            </div>}
    </div>
}