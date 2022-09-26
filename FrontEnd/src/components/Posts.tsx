import { useQuery } from "@apollo/client"
import { GET_POSTS } from "../lib/queryPost"
import Hearth from "../lib/symbols/Hearth";
import { LoadingText } from "./LoadingText";
import { PostButtons } from "./Post Component/PostButtons";
import { UserPostView } from "./Post Component/UserPostView";

export const Posts: React.FC<{isSearch:boolean, fetch:Boolean, setFetch:Function, user:any}> = ({isSearch, fetch, setFetch, user})=>{

    const {loading, error, data, refetch} = useQuery(GET_POSTS, {
        variables:{
            limit: 5
        }
    });

    if(fetch){
        refetch();
        setFetch(false);
    }

    if(loading) return <LoadingText/>
    else return <div>
    
        {isSearch &&<div className="container bg" id="posts-container">
         <p className="text" id="title">Posts</p>
        </div>}


        {data.posts.map((post:any, index:number)=>{
            console.log(post)
            return <div className="container bg" id="posts-container" key={post.id}>
                <div className="flex items-center">
                    <img id="user-icon-posts" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="" />
                    <p className="text" id="likes-username">like's username</p>
                    <p className="text" id="grey">likes this</p>
                </div>
                <hr />
                
                <UserPostView userid={post.user_id}/>
                <div className="content-container">
                    {post.type === "image" && <img id="content-img" src={post.url} alt="" />}
                    {post.type === "video" && <video src={post.url} controls/>}
                    <p className="text" id="content-text"> {post.content_text}</p>
                </div>

                <div className="info-container">
                    <p className="text">{post.likes-1}</p>
                    <Hearth/>
                </div>

                <hr />

                <PostButtons user={user} post={post} setFetch={setFetch}/>
            </div>
        })}
        
    </div>
}