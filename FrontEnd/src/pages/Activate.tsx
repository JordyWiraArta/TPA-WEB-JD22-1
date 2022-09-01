import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext, widthContext } from "../App";
import { Link } from "react-router-dom";
import '../stylings/activate.scss';
import { useMutation } from "@apollo/client";
import { ACTIVATE_ACCOUNT } from "../lib/query";


export default function Activate(){
    const {currTheme} = useContext(ThemeContext);
    const {width, setWidth} = useContext(widthContext);

    const navigateTo = useNavigate();
    let container = "container";

    const {code} = useParams();
    const [setActive, {loading, error, data}] = useMutation(ACTIVATE_ACCOUNT, {
        variables:{
            code: code
        }
    });
    const currPath = window.location.pathname;
    const arrPath = currPath.split("/");

    // if(arrPath[1])
    // setActive();
    // console.log(data);

    // setActive().then(()=>console.log(error));
    // console.log(data);
    // console.log(data);
    if(data === undefined ){
        setActive().catch((err) =>{
            navigateTo("/");
        });
    } 

    if(width <1200 && width >499) container = "container-md";
    else if(width < 499) container = "container-sm"

    return <div className={currTheme} id={container}>
            <p className="text" id="title">Your Activation Account Succeed!</p>
            <Link className="text" id="btn" to="/">go to login page</Link>
    </div>
}