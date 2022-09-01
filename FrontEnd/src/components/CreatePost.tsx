import { useState } from "react"
import { CreatePostModal } from "./CreatePostModal";

export const CreatePost: React.FC<{}> = ({})=>{

    const [open, setOpen] = useState(false);

    return <div className="container flex items-center bg" id="create-post">

        {open && <CreatePostModal setOpen={setOpen}/>}
        <img id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
        <input onClick={()=>setOpen(true)} className="text" id="create-input" type="text" placeholder="Start a post"/>
    </div>
}