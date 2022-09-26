import { useQuery } from "@apollo/client"
import { useContext } from "react";
import { searchContext } from "../lib/contexts/searchContext";
import { GET_CURR_USER } from "../lib/query";
import { GET_POSTS } from "../lib/queryPost"
import Hearth from "../lib/symbols/Hearth";
import { NumberComment } from "../lib/symbols/PostFeatures";
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

    const {search} = useContext(searchContext);
    console.log(search);
    if(loading) return <LoadingText/>
    else return <div>
    
        {isSearch &&<div className="container bg" id="posts-container">
         <p className="text" id="title">Posts</p>
        </div>}


        {data.posts.map((post:any, index:number)=>{
            let valid = false;

            if(isSearch) {
                
                if(post.content_text.includes(search))valid = true;
            }
            else if(!isSearch) valid = true;

            if(valid) return <div className="container bg" id="posts-container" key={post.id}>
                
                <UserPostView userid={post.user_id} type={"post"}/>

                <hr />
                <div className="content-container">
                    {post.type === "image" && <img id="content-img" src={post.url} alt="" />}
                    {post.type === "video" && <video src={post.url} controls/>}
                    <p className="text" id="content-text"> {post.content_text}</p>
                </div>

                <div className="info-container">
                    <p className="text" id="counter">{post.comments-1}</p>
                    <NumberComment/>
                    <p className="text" id="counter">{post.likes-1}</p>
                    <Hearth/>
                </div>

                <hr />

                <PostButtons user={user} post={post} setFetch={setFetch}/>
            </div>
        })}
        
    </div>
}