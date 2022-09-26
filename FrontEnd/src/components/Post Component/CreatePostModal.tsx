import '../../stylings/modal.scss'
import {Close} from '../../lib/symbols/Close'
import { MentionsInput, Mention } from 'react-mentions'
import { useContext, useState } from 'react'
import { Image, Video } from '../../lib/symbols/ImageVid'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_USERS } from '../../lib/query'
import { ThemeContext } from '../../App'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../firebase'
import { CREATE_POST } from '../../lib/queryPost'

export const CreatePostModal: React.FC<{setOpen:Function, user:any, setFetch:Function}> = ({setOpen, user, setFetch})=>{

    const [postText, setPostText] = useState("");
    const {currTheme} = useContext(ThemeContext);

    const {loading, error, data} = useQuery(GET_ALL_USERS);
    const [errMsg, setErrMsg] = useState("");
    const [loadFile, setLoadFile] = useState(false);

    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [createPost] = useMutation(CREATE_POST);
    

    let hashTag = [
        {
            id:"1",
            display:"test"
        }
    ]

    function getUsers(){
        const userData = [{
            id: "",
            display: "",
        }];
    
        if(!loading){
            data.users.forEach((element:any, index:number) => {
                userData[index] = {
                    id: element.id,
                    display: element.first_name + " " + element.last_name};
            });
        }

        return userData;
    }

    const lightInput = {
        input: {
            padding: 7,
            overflow: "auto",
        },
        suggestions: {
            top: "unset",
            list: {
              backgroundColor: "white",
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 14,
            },
            item: {
              padding: "5px 15px",
              borderBottom: "1px solid rgba(0,0,0,0.15)",
              "&focused": {
                backgroundColor: "#f1f4fc"
              }
            }
          }
    }

    const darkInput = {
        input: {
            padding: 7,
            overflow: "auto",
            color: "#FFFFFF"
        },
        suggestions: {
            top: "unset",
            list: {
              backgroundColor: "black",
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 14,
              color: "white"
            },
            item: {
              padding: "5px 15px",
              borderBottom: "1px solid rgba(0,0,0,0.15)",
              "&focused": {
                backgroundColor: "#0f0f0f"
              }
            }
          }
    }

    const defaultMentionStyle = {
        margin: 0,
        padding:0,
        backgroundColor: "rgba(59,130,246,1)"
    };

    const defaultHashtagStyle = {
        margin: 0,
        padding: 0,
        backgroundColor: "#0077b5"
    }

    function addImage(e:any){
        let imageFile = e.target.files![0];
        let extFile = imageFile!.name.split(".");
        if( extFile[1] !== "jpg" && extFile[1] !== "jpeg" && extFile[1] !== "png" && extFile[1] !== "jfif" && extFile[1] !== "gif") {
            setErrMsg("Please input image file .png, .jpg, .jpeg, .gif, or .jfif");
            return;
        }
        setErrMsg("");

        setLoadFile(true);
        setVideoUrl("");
        const alphabets = "abcdefghijklmnopqrstuvwxyz1234567890";
        let randUid = "";
        for(let i = 0; i<6; i++){
            let number = Math.round(Math.random()*36)
            randUid += alphabets[number];
        }
        const imageRef = ref(storage, `images/${imageFile!.name}${randUid}`);
        uploadBytes(imageRef, imageFile!).then(()=>{
            
            getDownloadURL(imageRef).then((url) =>{             
                setImageUrl(url);
                setLoadFile(false);
            })
            
        })
    }

    function addVideo(e:any){
        let videoFile = e.target.files![0];
        let extFile = videoFile!.name.split(".");
        if( extFile[1] !== "mp4" && extFile[1] !== "mkv") {
            setErrMsg("Please input image file .mp4 or .mkv");
            return;
        }
        setErrMsg("");

        setLoadFile(true);
        setImageUrl("");
        const alphabets = "abcdefghijklmnopqrstuvwxyz1234567890";
        let randUid = "";
        for(let i = 0; i<6; i++){
            let number = Math.round(Math.random()*36)
            randUid += alphabets[number];
        }
        const videoRef = ref(storage, `videos/${videoFile!.name}${randUid}`);
        uploadBytes(videoRef, videoFile!).then(()=>{          
            getDownloadURL(videoRef).then((url) =>{             
                setVideoUrl(url);
                setLoadFile(false);
            }).catch((err)=>{
                console.log(err)
            })
            
        })
    }

    function handleCreatePost(){
        if(postText === ""){
            setErrMsg("Please fill the text!");
            return;
        } 
        setErrMsg("");
        let type = "";
        let url = "";
        if(imageUrl !== ""){ 
            type = "image";
            url = imageUrl;
        }
        else if(videoUrl !== "") {
            type = "video";
            url = videoUrl;
        }

        // let filter = postText;
        // let counter = 0;
        // while(true){
        //     let sliced = filter.slice(filter.indexOf("@")+1, filter.indexOf(")")+1);
        //     console.log(sliced);
        //     let username = sliced.slice(sliced.indexOf("[")+1, sliced.indexOf("]"));
        //     filter = filter.replace(sliced, username);

        //     console.log(filter);
            
        //     if(sliced === "") break;
        // }


        createPost({variables:{
            userid: user.id,
            urlType: type,
            content: postText,
            url: url,
        }}).then(()=>{
            setOpen(false);
            setFetch(true);
        }).catch((err)=>{
            console.log(err);
        })
    }

    return <div className="modal-post">
            <div className = "create-post-modal bg">
                <div className="header">
                <p className="text" id="title">Create Post</p>
                <Close setOpen={setOpen}/>
                </div>
                <hr />
                <div className="flex items-center" id="header-user">
                     {user.profile_photo === "" ? <img id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
        : <img id="user-icon" src={user.profile_photo} alt="" />}
                    <p className="text" id="username">{user.first_name + " " + user.last_name}</p>
                </div>

                <div className='file-container'>
                    {loadFile && <div className='text'>loading..</div>}
                    <div className='files'>
                    {!loadFile && imageUrl !== "" && <img id="image-post" src={imageUrl} alt="" />}
                    {!loadFile && videoUrl !== "" && <video id="image-post" src={videoUrl} controls/>}
                    </div>
                    {!loadFile && (imageUrl !== "" || videoUrl !== "")&& <div className='text' id="btn-remove" onClick={()=>{
                        setImageUrl("");
                        setVideoUrl("");
                    }}>remove</div>}
                </div>
                

                <MentionsInput className="text create-input " placeholder="What do you want to talk about?" value={postText} onChange={(e:any)=>{setPostText(e.target.value)}} style={currTheme === "light"? lightInput:darkInput}>
                <Mention
                    trigger="@"
                    data={getUsers}
                    style={defaultMentionStyle}
                />
                <Mention
                    trigger="#"
                    markup='#[__display__](__id__)'
                    data={hashTag}
                    style={defaultHashtagStyle}
                />
                </MentionsInput>

                {errMsg !== "" && <p className="text" id="errorMsg">{errMsg}</p>}

                <div className="footer-modal">
                    <div className="buttons flex items-center">
                        <label className="flex items-center" id="button">
                        <Image/>
                        <p className="text">Image</p>
                        <input type="file" onChange={(e)=>{addImage(e)}}/>
                        </label>

                        <label className="flex items-center" id="button">
                        <Video/>
                        <p className="text">Video</p>
                        <input type="file" onChange={(e)=>{addVideo(e)}}/>
                        </label>
                    </div>

                    <div id="btn-post" onClick={()=> handleCreatePost()}>
                        post
                    </div>
                </div>    
                
            </div>

        </div>
}