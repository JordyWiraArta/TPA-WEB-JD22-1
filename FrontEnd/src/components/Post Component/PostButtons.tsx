import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { GET_LIKED, LIKES, UNLIKE } from "../../lib/queryPost"
import { Comment, Like, Liked, Send, Share } from "../../lib/symbols/PostFeatures"
import { CommentComponent } from "./Comment"

export const PostButtons: React.FC<{user:any, post:any, setFetch:Function}> = ({user, post, setFetch})=>{

    const {loading, error, data} = useQuery(GET_LIKED, {
        variables:{
            userid: user.id,
            postid: post.id
        }
    })

    const [showComment, setShowComment] = useState(false);

    const [like, setLike] = useState<any>(undefined)

    if(!loading){
        if(data.likedPosts.length <= 0 && like === undefined){
            setLike(false);
        } else if(data.likedPosts.length > 0 && like === undefined) {
            setLike(true);
        }
    }

    const [likePost] = useMutation(LIKES);
    const [unlikePost] = useMutation(UNLIKE);

    function handleLike(){
        if(like){
            unlikePost({variables:{
                userid: user.id,
                postid: post.id
            }}).then(()=>{
                setLike(false)
                setFetch(true)
            }).catch((err)=>{
                console.log(err);
            })
        } else if(!like){
            likePost({variables:{
                userid: user.id,
                postid: post.id
            }}).then(()=>{
                setLike(true)
                setFetch(true)
            }).catch((err)=>{
                console.log(err);
            })
        }
    }

    return <div className="footer-post">
        <div className="buttons flex">
            <div className="flex items-center" id="btn" onClick={handleLike}>
                {like ? <Liked/> : <Like/>}
                <p className="text">Like</p>
            </div>

            <div className="flex items-center" id="btn" onClick={()=> {
                if(showComment) setShowComment(false);
                else setShowComment(true);
                }}>
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

        {showComment && <CommentComponent user={user} post={post} setFetchPost={setFetch}/>}
    </div> 
}