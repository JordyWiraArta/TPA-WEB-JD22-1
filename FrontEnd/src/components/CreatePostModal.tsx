import '../stylings/modal.scss'
import {Close} from '../lib/symbols/Close'
import { MentionsInput, Mention } from 'react-mentions'
import { useState } from 'react'
import { Image, Video } from '../lib/symbols/ImageVid'

export const CreatePostModal: React.FC<{setOpen:Function}> = ({setOpen})=>{

    const [postText, setPostText] = useState();

    const userData = [{
        id:"1",
        display: "Jordy"
    },{
        id:"2",
        display:"user 2",
    }
    
    ];

    return <div className="modal">
            <div className = "create-post-modal bg">
                <div className="header">
                <p className="text" id="title">Create Post</p>
                <Close setOpen={setOpen}/>
                </div>
                <hr />
                <div className="flex items-center" id="header-user">
                    <img id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
                    <p className="text" id="username">Username</p>
                </div>

                <MentionsInput className="create-input text" placeholder="What do you want to talk about?" value={postText} onChange={(e:any)=>{setPostText(e.target.value)}}>
                <Mention
                    trigger="@"
                    data={userData}
                />
                <Mention
                    trigger="#"
                    data={userData}
                />
                </MentionsInput>

                <div className="footer">
                    <div className="buttons flex items-center">
                        <div className="flex items-center" id="button">
                        <Image/>
                        <p className="text">Image</p>
                        </div>

                        <div className="flex items-center" id="button">
                        <Video/>
                        <p className="text">Video</p>
                        </div>
                    </div>

                    <div id="btn-post">
                        post
                    </div>
                </div>    
            </div>
        </div>
}