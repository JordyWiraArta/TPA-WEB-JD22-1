import { useQuery } from "@apollo/client"
import { useState } from "react"
import { GET_EDUCATION, GET_EXPERIENCE } from "../lib/queryProfile"
import { Add } from "../lib/symbols/add"
import { Edit } from "../lib/symbols/Edit"

export const Education: React.FC<{setOpen:Function, id:string, fetch: Boolean, setFetch: Function, setUpd:Function}> = ({setOpen, id, fetch, setFetch, setUpd}) =>{
        const {loading, data, error, refetch} = useQuery(GET_EDUCATION, {variables:{
            id:id
        }});

        
        let educations = null
        if(!loading){
            educations = data.userEducations;
        }

        if(fetch){
            refetch();
            setFetch(false);
        }


    return <div className="profile-component bg">
        <div className="header-component">
            <p className="text" id="sub-title">Education</p>
            <div id="btn-add"
            onClick={()=> setOpen(true)}>
                <Add/>
            </div>
        </div>

        <div className="item-component">
            {educations === null ? "loading" : educations.map((edu:any, index:number)=>{
                return <div>
                    <hr />
                    <div className="item">
                        <div>
                            <p className="text" id="title">{edu.school + " (" + edu.start_date.split("-")[0] + " - " + edu.end_date.split("-")[0] + ")"}</p>
                            <p className="text" id="secondary">{edu.degree + " " + edu.field_of_study}</p>
                        </div>
                        <div className="btn-contain">
                            <div className="btn-edit-round text" id="label"
                            onClick={()=>{
                                setUpd(edu);
                                setOpen(true);
                            }}
                            > Edit
                                <Edit/>
                            </div>
                        </div>
                    </div>
                </div> 
            })}
        </div>
    </div>
}