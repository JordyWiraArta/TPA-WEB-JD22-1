import { useQuery } from "@apollo/client";
import { useContext, useState } from "react"
import { ThemeContext } from "../App"
import { LoadingText } from "../components/LoadingText";
import { PostJobModal } from "../components/Post Component/PostJobModal";
import { GET_JOB_POSTS } from "../lib/queryPost";
import '../stylings/job.scss'

export default function Job(){

    const {currTheme} = useContext(ThemeContext);
    const [open, setOpen] = useState(false);
    const [fetch, setFetch] = useState(false);

    const {loading, error, data, refetch} = useQuery(GET_JOB_POSTS);

    if(fetch){
        refetch();
        setFetch(false);
    }

    if(loading) return <LoadingText/>
    else return <div className={currTheme} id="job-container">
        <div className="text" id="btn-create" onClick={()=>setOpen(true)}>
            Post Job Offer
        </div>

        <div className="container bg">
            <p className="text" id="title">Jobs</p>
            {
                data.jobPosts.map((jobPost:any)=>{
                    return <div>
                        <hr />
                        <div className="flex" id="job">
                            <div className="flex" id="left">
                                <img id="company-logo" src={jobPost.logo_url} alt="" />
                                <div className="data">
                                    <p className="text" id="job-name">{jobPost.job_name}</p>
                                    <p className="text" id="company-name">{jobPost.company_name}</p>
                                    <p className="text" id="company-location">{jobPost.location}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                })
            }
            
        </div>

        {open && <PostJobModal setFetch={setFetch} setOpen={setOpen}/>}
    </div>
}