import { Fragment } from "react";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile  from "./Profile";

export default function HomeNavigation(){


    return <Routes>
            <Route path="/home" element={
            <Home/>
            }/>
            <Route path="/profile" element={
                <Profile/>
            }/>
        </Routes>
}