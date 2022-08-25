import { useContext, useState } from 'react';
import { ThemeContext, widthContext } from '../App';
import '../stylings/login.scss';
import { Link } from 'react-router-dom';

export default function LoginPage(){

    const {currTheme} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);
    let foreBox = "foreBox";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if(width <1200 && width >499) foreBox = "foreBox-md";
    else if(width < 499) foreBox = "foreBox-sm";

    if(currTheme === "dark"){
        document.body.style.backgroundColor = "#000000";
    } else {
        document.body.style.backgroundColor = "#FFFFFF";
    }

    return <div className={currTheme}>
        <div className="sbg" id={foreBox}>
            <p className="text" id="title">Sign In</p>
            <p className="text" id="sub-title">Stay updated in Linkhed In</p>
            <div id="inputDiv">
                <input className="text" id="inputBox" type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="Email Address"/>
                <input className="text" id="inputBox" type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="Password"/>
            </div>
            
            <button className="text" id="buttonSignIn">Sign In</button>

            <p className="text" id="or">or</p>

            <button className="center-row" id="buttonGoogle">
                <img src="https://freesvg.org/img/1534129544.png" alt="" />
                <p> Sign In with Google</p>
            </button>
        </div>

        <Link to="/regis">home</Link>
    </div>
}