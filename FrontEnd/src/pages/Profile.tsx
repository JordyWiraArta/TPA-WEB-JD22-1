import { useContext } from "react"
import { ThemeContext } from "../App"
import "../stylings/profile.scss";
import { Camera } from "../lib/symbols/ImageVid";
import { Edit } from "../lib/symbols/Edit";
import { authContext } from "../lib/contexts/authContext";


export default function Profile (){

    const {currTheme} = useContext(ThemeContext);
    const {user} = useContext(authContext);
    console.log(user)

    return <div className={currTheme}>
        <div className="profile bg">
            <div className="button-bg">
                <Camera/>
            </div>
            <img id="background-img" src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2021/03/LinkedIn-Default-Background-2020-.jpg" alt="" />
            <div className="">
            <div className="button-edit">
                <Edit/>
            </div>
            <img id="user-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" />
            </div>

            <div className="profile-data">
                <p className="text" id="username">{user.first_name + " " + user.last_name}</p>
                <p className="text" id="education">Student at Binus University</p>
                <p className="text" id="connection">10 Connections</p>
            </div>
        </div>
    </div>
    
}