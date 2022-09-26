import { useContext, useState } from 'react';
import { ThemeContext, widthContext } from '../App';
import '../stylings/login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../lib/contexts/authContext';
import { Audio } from 'react-loader-spinner'
import { useMutation, useQuery } from '@apollo/client';
import { GET_CURR_USER, LOGIN } from '../lib/query';
import { useRef } from 'react';
import { useEffect } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

export default function LoginPage(){

    const {currTheme} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);
    const {setId} = useContext(authContext);
    let foreBox = "foreBox";
    let signUp = "signUp";
    let container = "container";

    const navigateTo = useNavigate();
    
    const [errorMsg, setErrorMsg] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [authentication] = useMutation(LOGIN);

    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    if(width <1200 && width >499) {
        foreBox = "foreBox-md";
        container = "container-md";
    }
    else if(width < 499) {
        signUp ="signUp-sm";
        foreBox = "foreBox-sm";
        container = "container-sm";
    }

    
    // if(currTheme === "dark"){
    //     document.body.style.backgroundColor = "#000000";
    // } else {
    //     document.body.style.backgroundColor = "#FFFFFF";
    // }

    function signIn(){
        let email ="";
        let password ="";
        if(emailRef.current !== null && passRef.current !== null){
            email = emailRef.current.value;
            password = passRef.current.value;
        }


        if(email === "" || password === ""){
            setErrorMsg("please fill all the blanks");
            return;
        }

        
        if(!email.includes("@") || !email.endsWith(".com")){
            setErrorMsg("invalid email!");
            return;
        }

        setRedirect(true);
        authentication({ 
            variables: {
                email:email,
                password:password
            }
        }).then((data)=>{
            localStorage.setItem('userid', JSON.stringify(data.data.login.id));
            setId(data.data.login.id);
            navigateTo("/linkhedIn/home");
        }).catch((err)=>{
            setErrorMsg(err.message);
            setRedirect(false);
            return;
        })
    }

    const googleLogin = useGoogleLogin({
        onSuccess: credentialResponse => console.log(jwtDecode(credentialResponse.scope)),
      });

    // function handleCallBackResponse(response){
    //     console.log(response)
    // }

    //   useEffect(()=>{
    //       google.accounts.id.initialize({
    //           client_id: "632641386729-n48bsd26gp5kpboabmc6141d88478gge.apps.googleusercontent.com",
    //           callback: handleCallBackResponse
    //       })
    //   }, [])

    

    if(redirect === true) {

    return <div className={currTheme} id="container">
         <p id="title">Redirecting</p>
         <Audio
            height="80"
            width="80"
            color="black"
            ariaLabel="loading"
            />
    </div>
    }
    else return <div className={currTheme}>
        <div className="sbg" id={foreBox}>
            <p className="text" id="title">Sign In</p>
            <p className="text" id="sub-title">Stay updated in Linkhed In</p>
            <div id="inputDiv">
                <input ref={emailRef} className="text inputBox" id="email" type="email" placeholder="Email Address"/>
                <input ref={passRef} className="text inputBox" id="password" type="password" placeholder="Password"/>
            </div>
            
            <Link id="link" to="/forgotPass/first">Forgot your password?</Link>

            {errorMsg !== "" && <p className="text" id="errorMsgS">{errorMsg}</p>}

            <button onClick={()=> {signIn()}} className="text" id="buttonSignIn">Sign In</button>

            <p className="text" id="or">or</p>

            <button onClick={()=>googleLogin()} className="center-row" id="buttonGoogle">
                <img src="https://freesvg.org/img/1534129544.png" alt="" />
                <p> Sign In with Google</p>
            </button>
        </div>

        <div className="text center-row" id={signUp}>
            not have account?
            <Link id="link" to="/regis">Sign Up</Link>
        </div>
    </div>
}