import { useContext, useState } from "react";
import { ThemeContext, widthContext } from "../App";
import { Link } from "react-router-dom";
import '../stylings/login.scss'
import { authContext } from "../lib/contexts/authContext";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_NEW_USER } from "../lib/query";

export default function RegisPage(){
    const {currTheme} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);

    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState("");

    let foreBox = "foreBox";
    let signIn = "signIn";
    let title = "title-out";
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");


    const [createUser] = useMutation(CREATE_NEW_USER, {
        variables: {
            email:email,
            password:password,
            first_name:firstName,
            last_name:lastName,
            job:""
        },
    });

    const {user, setUser} = useContext(authContext);

    if(width <1200 && width >499) {
        title = "title-md";
        foreBox = "foreBox-md";
    }
    else if(width < 499) {
        signIn ="signIn-sm";
        foreBox = "foreBox-sm";
        title = "title-sm";
    }

    // if(currTheme === "dark"){
    //     document.body.style.backgroundColor = "#000000";
    // } else {
    //     document.body.style.backgroundColor = "#FFFFFF";
    // }

    function regis(){

        if(email === "" || firstName === "" || lastName === "" || password === "" || confirmPassword === ""){
            setErrorMsg("fill all the blanks!");
            return;
        }

        if(!email.includes("@") || !email.endsWith(".com")){
            setErrorMsg("invalid format email!");
            return;
        }

        if(password !== confirmPassword){
            setErrorMsg("unmatched password!");
            return;
        }
        setSuccess("wait a minute, processing your registration...");
        setErrorMsg("");
        createUser().then(()=>{
            setSuccess("An email is already sent for your activation account!");
            setErrorMsg("");
        }).catch((err)=>{
            console.log(err)
            setErrorMsg(err.message);
            setSuccess("");
        })
    }

    
    return <div className={currTheme}>

        <p className="text" id={title}>Make the most of your profesional Life!</p>

        <div className="sbg" id={foreBox}>
            <div id="inputDiv">
                { (width>1400 || (width<1200 && width >800)) &&  <div id="name">
                    <input className="text" id="input" type="text" onChange={(e)=> setFirstName(e.target.value)} placeholder="First Name"/>
                    <input className="text" id="input" type="text" onChange={(e)=> setLastName(e.target.value)} placeholder="Last Name"/>
                </div>}
                
                {((width>1200 && width<1400) ||width <800) &&
                    <input className="text inputBox" id="firstName" type="text" onChange={(e)=> setFirstName(e.target.value)} placeholder="First Name"/>
                }
                {((width>1200 && width<1400) ||width <800) && <input className="text inputBox" id="lastName" type="text" onChange={(e)=> setLastName(e.target.value)} placeholder="Last Name"/>
                    }
                
                <input className="text inputBox" id="email" type="email" onChange={(e)=> setEmail(e.target.value)} placeholder="Email Address"/>
                <input className="text inputBox" id="password" type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="Password"/>
                <input className="text inputBox" id="confirmPassword" type="password" onChange={(e)=> setConfirmPassword(e.target.value)} placeholder="Confirm Password"/>
            </div>

            {errorMsg !== "" && <p className="text" id="errorMsg">{errorMsg}</p>}

            {success !== "" && <p className="text" id="success">{success}</p>}
            
            <button onClick={()=> regis()} className="text" id="buttonSignIn">Sign Up</button>

            <p className="text" id="or">or</p>

            <button className="center-row" id="buttonGoogle">
                <img src="https://freesvg.org/img/1534129544.png" alt="" />
                <p> Sign In with Google</p>
            </button>
        </div>

        <div className="text center-row" id={signIn}>
            already have account?
            <Link id="link" to="/">Sign In</Link>
        </div>
    </div>
}