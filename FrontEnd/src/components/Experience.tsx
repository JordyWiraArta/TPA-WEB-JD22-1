import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_EXPERIENCE } from "../lib/queryProfile";
import { Add } from "../lib/symbols/add"
import { Edit } from "../lib/symbols/Edit";
import { InputExperience } from "./ProfileModal";

export const Experience: React.FC<{setOpen:Function, id:String, fetch:Boolean, setFetch:Function, setUpd:Function}> = ({setOpen, id, fetch, setFetch, setUpd}) =>{

    const {loading, data, error, refetch} = useQuery(GET_EXPERIENCE, {variables:{
        id:id
    }});

    let experiences = null
    if(!loading){
        experiences = data.userExperiences;
    }

    if(fetch){
        refetch();
        setFetch(false);
    }

    return <div className="profile-component bg">
        <div className="header-component">
            <p className="text" id="sub-title">Experience</p>
            <div id="btn-add" onClick={()=> setOpen(true)}>
                <Add/>
            </div>
        </div>

        <div className="item-component">
            {experiences === null ? "loading" : experiences.map((exp:any, index:number)=>{
                return <div>
                    <hr />
                    <div className="item">
                        <div>
                            <p className="text" id="title">{exp.title + " (" + exp.start_date.split("-")[0] + " - " + exp.end_date.split("-")[0] + ")"}</p>
                            <p className="text" id="secondary">{exp.employment_type}</p>
                            <p className="text" id="tertiary">Company Name: {exp.company_name}</p>
                            <p className="text" id="quartery">location: {exp.location}</p>
                        </div>

                        <div className="btn-contain">
                            <div className="btn-edit-round text" id="label" onClick={()=>{
                                setOpen(true);
                                setUpd(exp);
                            }}> Edit
                                <Edit/>
                            </div>
                        </div>
                    </div>
                </div> 
            })}
        </div>
        
    </div>
}