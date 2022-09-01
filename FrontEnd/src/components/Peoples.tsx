export const Peoples: React.FC<{}> = ({})=>{
    return <div className="container bg" id="peoples-container">
       <p className="text" id="title">People</p>
       <div className="flex" id="people">
            <div className="flex" id="left">
                <img id="user-icon-peoples" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
                <div className="data">
                    <p className="text" id="username">Username</p>
                    <p className="text" id="job">Job</p>
                </div>
            </div>
            <div className="button text" id="btn-connect">
                Connect
            </div>
       </div>
       <hr />
    </div>
}