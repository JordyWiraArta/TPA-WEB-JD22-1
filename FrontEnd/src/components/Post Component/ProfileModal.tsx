import '../../stylings/modal.scss'
import { Close } from '../../lib/symbols/Close'
import { useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { INSERT_EDUCATION, INSERT_EXPERIENCE, UPDATE_EDUCATION, UPDATE_EXPERIENCE } from '../../lib/queryProfile'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../firebase'
import { UPDATE_USER } from '../../lib/query'

export const UpdateProfile: React.FC<{setOpen:Function,  setFetch:Function, user:any}> = ({setOpen, setFetch,  user})=>{

    const [profileImg, setProfileImg] = useState(""); 
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const jobRef = useRef<HTMLInputElement>(null);
    const [loadImg, setLoadImg] = useState(false);

    const [updatesProfile] = useMutation(UPDATE_USER);
    const [errMsg, setErrMsg] = useState("");

    function handleUploadImage(e:any){
        let imageFile = e.target.files![0];
        let extFile = imageFile!.name.split(".");
        if( extFile[1] !== "jpg" && extFile[1] !== "jpeg" && extFile[1] !== "png" && extFile[1] !== "jfif") {
            setErrMsg("Please input image file .png, .jpg, .jpeg, or .jfif");
            return;
        }
        setErrMsg("");

        setLoadImg(true);
        const alphabets = "abcdefghijklmnopqrstuvwxyz1234567890";
        let randUid = "";
        for(let i = 0; i<6; i++){
            let number = Math.round(Math.random()*36)
            randUid += alphabets[number];
        }
        const imageRef = ref(storage, `images/${imageFile!.name}${randUid}`);
        uploadBytes(imageRef, imageFile!).then(()=>{
            
            getDownloadURL(imageRef).then((url) =>{             
                setProfileImg(url);
                setLoadImg(false);
            })
            
        })
    }

    if(user.profile_photo !== "" && profileImg === ""){
        setProfileImg(user.profile_photo);
    }

    function updateProfile(){
        let firstName = firstNameRef.current?.value;
        let lastName = lastNameRef.current?.value;
        let job = jobRef.current?.value;

        if(firstName === "" || lastName === ""){
            setErrMsg("Please Fill the firstname and lastname");
            return;
        }
        setErrMsg("");


        updatesProfile({variables:{
            id: user.id,
            input:{
                first_name: firstName,
                last_name: lastName,
                email: "",
                password: "",
                profile_photo: profileImg,
                background_photo: "",
                headline: "",
                job: job
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
                
                    {loadImg && <div id="loading">loading..</div>}
                    {profileImg !== "" && !loadImg && <img id="user-icon" src={profileImg} alt="" />}
                    {profileImg === "" && !loadImg && <img id="user-icon" src="https://www.shareicon.net/data/512x512/2016/02/22/722964_button_512x512.png" alt="" />}
                    <label className="text" id="btn-change-profile-image">
                        Change Profile Image
                        <input id="file-input" type="file" onChange={(e) => {
                            handleUploadImage(e);
                        }} /> 
                    </label>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">First Name</p>
                    <input ref={firstNameRef} className='input-update' type="text" defaultValue={user.first_name} placeholder=""/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Last Name</p>
                    <input ref={lastNameRef} className='input-update' type="text" defaultValue={user.last_name} placeholder=""/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">job</p>
                    <input ref={jobRef} className='input-update' type="text" defaultValue={user.job} placeholder="Ex: Student, CEO, .."/>
                </div>
                <div className="footer-modal">

                <div id="btn-post" onClick={()=>{ 
                    updateProfile();
                }}>
                    Update
                </div>

                </div>
                {errMsg !== "" && <p className="text" id="errorMsg">{errMsg}</p>}
            </div>
        </div>
}

export const InputExperience: React.FC<{setOpen:Function, setFetch:Function, userid:String, upd:any, setUpd:Function}> = ({setOpen, setFetch, userid, upd, setUpd})=>{
    const [error, setError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const employmentRef = useRef<HTMLInputElement>(null);
    const companyNameRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    var title = "";
    var employment = "";
    var companyName = "";
    var location = "";
    var startDate = "";
    var endDate = "";

    if(upd !== null){
        title = upd.title;
        employment = upd.employment_type;
        companyName = upd.company_name;
        location = upd.location;
        startDate = upd.start_date;
        endDate = upd.end_date;
    }

    const [insertExperience] = useMutation(INSERT_EXPERIENCE);
    const [updateExperience] = useMutation(UPDATE_EXPERIENCE);

    function addNewExp(){
        let title = titleRef!.current?.value;
        let employment = employmentRef!.current?.value;
        let companyName = companyNameRef!.current?.value;
        let location = locationRef!.current?.value;
        let startDate = startDateRef!.current?.value;
        let endDate = endDateRef!.current?.value;

        if(title === "" || employment === "" || companyName === "" || location === "" || startDate === "" || endDate === ""){
            setError("please fill all the blanks!");
            return;
        } else setError("");
        
        if(upd === null){
            insertExperience({variables:{
                input:{
                    user_id:userid,
                    title:title,
                    employment_type:employment,
                    company_name:companyName,
                    location: location,
                    start_date: startDate,
                    end_date: endDate
                }
            }}).then(()=>{
                setFetch(true);
                setOpen(false);
            }).catch((err) =>{
                console.log(err);
            })
        } else{
            updateExperience({variables:{
                id: upd.id,
                input:{
                    user_id:userid,
                    title:title,
                    employment_type:employment,
                    company_name:companyName,
                    location: location,
                    start_date: startDate,
                    end_date: endDate
                }
            }}).then(()=>{
                setFetch(true);
                setUpd(null);
                setOpen(false);
            }).catch((err)=>{
                console.log(err);
            })
        }

    }

    return <div className="modal">
            <div className = "profile-modal bg">
                <div className="header">
                <p className="text" id="title">Add Experience</p>
                <div onClick={()=>setUpd(null)}>
                    <Close setOpen={setOpen}/>
                </div>
                </div>
                <hr />
                <div className='input-block'>
                    <p className='text' id="input-label">Title</p>
                    <input ref={titleRef} className='input-update' type="text" defaultValue={title} placeholder="Ex: Manager of ..."/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Employment Type</p>
                    <input ref={employmentRef} className='input-update' type="text" defaultValue={employment} placeholder="Ex: Full Time, etc"/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Company Name</p>
                    <input ref={companyNameRef} className='input-update' type="text" defaultValue={companyName} placeholder="Ex: Bina Nusantara Company"/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Location</p>
                    <input ref={locationRef} className='input-update' type="text" defaultValue={location} placeholder="Ex: Jakarta, Jakarta Barat"/>
                </div>

                <div className='date-container'>
                    <div className='input-block'>
                        <p className='text' id="input-label">Start Date</p>
                        <input ref={startDateRef} className='input-update' type="date" defaultValue={startDate}/>
                    </div>

                    <div className='input-block'>
                        <p className='text' id="input-label">End Date</p>
                        <input ref={endDateRef} className='input-update' type="date" defaultValue={endDate}/>
                    </div>
                </div>
                <div className="footer-modal">
                    <div id="btn-addnew" onClick={addNewExp}>
                        {upd === null ? "Add": "update"}
                    </div>
                </div>
                {error !== "" && <p className="text" id="errorMsg">{error}</p>}
            </div>
        </div>
}


export const InputEducation: React.FC<{setOpen:Function, setFetch:Function, userid:String, upd:any, setUpd:Function}> = ({setOpen, setFetch, userid, upd, setUpd})=>{
    const [error, setError] = useState("");
    const schoolRef = useRef<HTMLInputElement>(null);
    const degreeRef = useRef<HTMLInputElement>(null);
    const fieldOfStudyRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    var school = schoolRef!.current?.value;
    var degree = degreeRef!.current?.value;
    var fieldOfStudy = fieldOfStudyRef!.current?.value;
    var startDate = startDateRef!.current?.value;
    var endDate = endDateRef!.current?.value;
    
    if(upd !== null){
        school = upd.school;
        degree = upd.degree;
        fieldOfStudy = upd.field_of_study;
        startDate = upd.start_date;
        endDate = upd.end_date;
    }

    const [insertEducation] = useMutation(INSERT_EDUCATION);
    const [updateEducation] = useMutation(UPDATE_EDUCATION);

    function addNewEdu(){
        let school = schoolRef!.current?.value;
        let degree = degreeRef!.current?.value;
        let fieldOfStudy = fieldOfStudyRef!.current?.value;
        let startDate = startDateRef!.current?.value;
        let endDate = endDateRef!.current?.value;

        if(school === "" || degree === "" || fieldOfStudy === "" || startDate === "" || endDate === ""){
            setError("please fill all the blanks!");
            return;
        } else setError("");
        
        if(upd === null){
            insertEducation({variables:{
                input:{
                    user_id:userid,
                    school: school,
                    degree: degree,
                    field_of_study: fieldOfStudy,
                    start_date: startDate,
                    end_date: endDate
                }
            }}).then(()=>{
                setFetch(true);
                setOpen(false);
            }).catch((err) =>{
                console.log(err);
            })
        } else{
            updateEducation({variables:{
                id: upd.id,
                input:{
                    user_id:userid,
                    school: school,
                    degree: degree,
                    field_of_study: fieldOfStudy,
                    start_date: startDate,
                    end_date: endDate
                }
            }}).then(()=>{
                setFetch(true);
                setUpd(null);
                setOpen(false);
            }).catch((err) =>{
                console.log(err);
            })
        }

    }

    return <div className="modal">
            <div className = "profile-modal bg">
                <div className="header">
                <p className="text" id="title">Add Education</p>
                <div onClick={()=>setUpd(null)}>
                    <Close setOpen={setOpen}/>
                </div>
                </div>
                <hr />
                <div className='input-block'>
                    <p className='text' id="input-label">School</p>
                    <input ref={schoolRef} className='input-update' type="text" defaultValue={school} placeholder="Ex: Stand Ford University"/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Degree</p>
                    <input ref={degreeRef} className='input-update' type="text" defaultValue={degree} placeholder="Ex: Bachelor"/>
                </div>

                <div className='input-block'>
                    <p className='text' id="input-label">Field of Study</p>
                    <input ref={fieldOfStudyRef} className='input-update' type="text" defaultValue={fieldOfStudy} placeholder="Ex: Information System"/>
                </div>

                <div className='date-container'>
                    <div className='input-block'>
                        <p className='text' id="input-label">Start Date</p>
                        <input ref={startDateRef} className='input-update' type="date" defaultValue={startDate}/>
                    </div>

                    <div className='input-block'>
                        <p className='text' id="input-label">End Date</p>
                        <input ref={endDateRef} className='input-update' type="date" defaultValue={endDate}
                        />
                    </div>
                </div>
                <div className="footer-modal">
                    <div id="btn-addnew" onClick={addNewEdu}>
                        {upd === null ? "Add": "update"}
                    </div>
                </div>
                {error !== "" && <p className="text" id="errorMsg">{error}</p>}
            </div>
        </div>
}