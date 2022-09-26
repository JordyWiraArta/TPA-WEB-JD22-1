import { useMutation } from "@apollo/client";
import { useRef } from "react";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext, widthContext } from "../App";
import { RESET_PASSWORD, SEND_RESET_EMAIL } from "../lib/query";

export default function ResetPass(){
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState("");
    const {currTheme} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);

    const [sendReset] = useMutation(SEND_RESET_EMAIL);
    const [resetPass] = useMutation(RESET_PASSWORD);

    const navigateTo = useNavigate();
    let foreBox = "foreBox";
    let signUp = "signUp";

    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const confPassRef = useRef<HTMLInputElement>(null);

    if(width <1200 && width >499) foreBox = "foreBox-md";
    else if(width < 499) {
        signUp ="signUp-sm";
        foreBox = "foreBox-sm";
    }

    const {code} =  useParams();

    // if(currTheme === "dark"){
    //     document.body.style.backgroundColor = "#000000";
    // } else {
    //     document.body.style.backgroundColor = "#FFFFFF";
    // }

    function SendEmail(){
        let email = "";
        if(emailRef.current !== null) email = emailRef.current.value;

        if(email === ""){ 
            setSuccess("");
            setErrorMsg("fill the blank!");
            return;
        }
        if(!email.includes("@") || !email.endsWith(".com")) {
            setErrorMsg("invalid email!");
            return;
        }
        
        setSuccess("processing...");
        setErrorMsg("");
        sendReset({
            variables:{
                email: email
            }
        }).then(()=>{
            setSuccess("we have send you an email for reset your password!");
            setErrorMsg("");
        }).catch((err)=>{
            setSuccess("");
            setErrorMsg(err.message);
        })
    }

    function ChangePassword(){
        let pass = "", confPass = "";
        if(passRef.current != null && confPassRef.current != null) {
            pass = passRef.current.value;
            confPass = confPassRef.current.value;
        }

        if(confPass === "" || pass === ""){
            setSuccess("");
            setErrorMsg("fill the blank!");
            return;
        }

        if(confPass !== pass){
            setSuccess("");
            setErrorMsg("unmatched password!");
            return;
        }

        setSuccess("processing...");
        setErrorMsg("");

        resetPass({variables:{
            code: code,
            password: pass
        }}).then((data)=>{
            console.log(data)
            setSuccess("reset password success!");
            setErrorMsg("");
            navigateTo("/");
        }).catch((err)=>{
            setSuccess("");
            setErrorMsg(err.message);
        })
    }

    if(code === "first") return <div className={currTheme}>
        <div className="sbg" id={foreBox}>
            <p className="text" id="title">Forgot Password?</p>
            <p className="text" id="sub-title">you can quickly reset it</p>
            <div id="inputDiv">
                <input className="text inputBox" id="email" type="email" ref={emailRef} placeholder="Email Address"/>
            </div>
            
            {errorMsg !== "" && <p className="text" id="errorMsg">{errorMsg}</p>}

            {success !== "" && <p className="text" id="success">{success}</p>}

            <button onClick={SendEmail} className="text" id="buttonChange">Reset</button>

            <button onClick={()=> navigateTo(-1)} className="text bg" id="buttonBack"> back </button>
        </div>
    </div>
    else return <div className={currTheme}>
    <div className="sbg" id={foreBox}>
        <p className="text" id="title">Forgot Password?</p>
        <p className="text" id="sub-title">you can quickly reset it</p>
        <div id="inputDiv">
            <input ref={passRef} className="text inputBox" id="password" type="password" placeholder="New Password"/>
            <input ref={confPassRef} className="text inputBox" id="confirmPassword" type="password" placeholder="Confirm Password"/>
        </div>
        {errorMsg !== "" && <p className="text" id="errorMsg">{errorMsg}</p>}

        {success !== "" && <p className="text" id="success">{success}</p>}
        <button onClick={ChangePassword} className="text" id="buttonChange">Reset</button>
        <button onClick={()=> navigateTo("/")} className="text bg" id="buttonBack"> back to login </button>
        </div>
    </div>
}