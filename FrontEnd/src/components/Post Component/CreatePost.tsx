export const CreatePost: React.FC<{user:any, setOpen:Function}> = ({user, setOpen})=>{

   

    return <div className="container flex items-center bg" id="create-post">

        {user.profile_photo === "" ? <img id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
        : <img id="user-icon" src={user.profile_photo} alt="" />}
        <input onClick={()=>setOpen(true)} className="text" id="create-input" type="text" placeholder="Start a post"/>
    </div>
}