import { Fragment } from "react";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile  from "./Profile";
import MyNetwork from "./MyNetwork";
import Job from "./Job";
import Messaging from "./Messaging";
import Notification from "./Notification";

export default function HomeNavigation(){


    return <Routes>
            <Route path="/home" element={
            <Home/>
            }/>
            <Route path="/profile/:otherid" element={
                <Profile/>
            }/>

            <Route path="/network" element={
                <MyNetwork/>
            }/>

            <Route path="/job" element={
                <Job/>
            }/>

            <Route path="/message" element={
                <Messaging/>
            }/>

            <Route path="/notif" element={
                <Notification/>
            }/>
        </Routes>
}