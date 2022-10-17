import { useContext, useState } from "react"
import { ThemeContext } from "../App";
import { UserHistory } from "../components/Message Component/UserHistory";
import { UserSearch } from "../components/Message Component/UserSearch";
import '../stylings/messaging.scss';

export default function Messaging(){
    const [searchUser, setSearchUser] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    
    const {currTheme} = useContext(ThemeContext);

    return <div className={currTheme} id="message-container">
        <div className="left-container bg">
            <div className="left-header">
                <div className="text" id="title" onClick={()=>{setIsSearch(false)}}>Messaging</div>
                <div id="searchBar">
                    <input onClick={()=>{setIsSearch(true)}} className="text" id="input" type="text" placeholder="Search User" onChange={(e)=>{
                        setSearchUser(e.target.value);
                    }} />
                </div>
            </div>
            <hr />
            {isSearch ? <UserSearch/> : <UserHistory/>}
        </div>

        <div className="right-container bg">
            test
        </div>
    </div>
}