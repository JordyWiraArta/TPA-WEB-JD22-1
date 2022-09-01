import { Send, Like, Comment, Share } from "../lib/symbols/PostFeatures"

export const Posts: React.FC<{isSearch:boolean}> = ({isSearch})=>{
    return <div className="container bg" id="posts-container">
        
        {isSearch && <p className="text" id="title">Posts</p>}

        <div className="flex items-center">
            <img id="user-icon-posts" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
            <p className="text" id="likes-username">like's username</p>
            <p className="text" id="grey">likes this</p>
        </div>
        <hr />
        <div className="poster-container flex items-center">
        <img id="user-icon" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
            <div>
            <p className="text" id="poster-username">Poster's username</p>
            <p className="text" id="grey">total follower</p>
            </div>
        </div>

        <div className="content-container">
            <img id="content-img" src="https://salesdorado.com/wp-content/uploads/2021/05/rediger-post-linkedin.jpg" alt="" />
            <p className="text" id="content-text"> this is example of the post content: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>

        <hr />

        <div className="buttons flex">
            <div className="flex items-center" id="btn">
                <Like/>
                <p className="text">Like</p>
            </div>

            <div className="flex items-center" id="btn">
                <Comment/>
                <p className="text">Comment</p>
            </div>

            <div className="flex items-center" id="btn">
                <Share/>
                <p className="text">Share</p>
            </div>

            <div className="flex items-center" id="btn">
                <Send/>
                <p className="text">Send</p>
            </div>
            
           
        </div>
    </div>
}