import { useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { storage } from "../../firebase";
import { CREATE_JOB_POST } from "../../lib/queryPost";
import { Close } from "../../lib/symbols/Close";

export const PostJobModal: React.FC<{setOpen:Function,  setFetch:Function}> = ({setOpen, setFetch})=>{

    const [logoImg, setLogoImg] = useState(""); 
    const companyLocationRef = useRef<HTMLInputElement>(null);
    const companyNameRef = useRef<HTMLInputElement>(null);
    const jobNameRef = useRef<HTMLInputElement>(null);
    const [load, setLoad] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [makeJobOffer] = useMutation(CREATE_JOB_POST); 

    function handleUploadImage(e:any){
        let imageFile = e.target.files![0];
        let extFile = imageFile!.name.split(".");
        if( extFile[1] !== "jpg" && extFile[1] !== "jpeg" && extFile[1] !== "png" && extFile[1] !== "jfif") {
            setErrMsg("Please input image file .png, .jpg, .jpeg, or .jfif");
            return;
        }
        setErrMsg("");

        setLoad(true);
        const alphabets = "abcdefghijklmnopqrstuvwxyz1234567890";
        let randUid = "";
        for(let i = 0; i<6; i++){
            let number = Math.round(Math.random()*36)
            randUid += alphabets[number];
        }
        const imageRef = ref(storage, `images/${imageFile!.name}${randUid}`);
        uploadBytes(imageRef, imageFile!).then(()=>{
            
            getDownloadURL(imageRef).then((url) =>{             
                setLogoImg(url);
                setLoad(false);
            })
            
        })
    }

    function postJob(){
        let companyName = companyNameRef.current?.value;
        let jobName = jobNameRef.current?.value;
        let companyLocation = companyLocationRef.current?.value;

        if(companyName === "" || jobName === "" || companyLocation === ""){
            setErrMsg("Please Fill all the blanks");
            return;
        }

        if(logoImg === ""){
            setErrMsg("please add a logo image");
            return;
        }
        setErrMsg("");

        makeJobOffer({variables:{
            input: {
                logo_url: logoImg,
                company_name: companyName,
                job_name: jobName,
                location: companyLocation
              }
        }}).then(()=>{
            setFetch(true);
            setOpen(false);
        }).catch((err)=>{
            console.log(err);
        })
    }

    return <div className="modal">
            <div className = "profile-modal bg">
                <div className="header">
                    <p className="text" id="title">Update Profile</p>
                    <Close setOpen={setOpen}/>
                </div>
                <hr />
                <div className="content">
                
                    {load && <div id="loading">loading..</div>}
                    {logoImg !== "" && !load && <img id="company-logo" src={logoImg} alt="" />}
                    <label className="text" id="btn-change-profile-image">
                        Add Company logo
                        <input id="file-input" type="file" onChange={(e) => {
                            handleUploadImage(e);
                        }} /> 
                    </label>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Job Name</p>
                    <input ref={jobNameRef} className='input-update' type="text" placeholder="The job Offer name.."/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Company Name</p>
                    <input ref={companyNameRef} className='input-update' type="text" placeholder="The company name..."/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Company Location</p>
                    <input ref={companyLocationRef} className='input-update' type="text" placeholder="Location.."/>
                </div>
                <div className="footer-modal">

                <div id="btn-post" onClick={()=>{ 
                    postJob();
                }}>
                    Post
                </div>

                </div>
                {errMsg !== "" && <p className="text" id="errorMsg">{errMsg}</p>}
            </div>
        </div>
}