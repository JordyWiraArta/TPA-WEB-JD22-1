import { useMutation, useQuery } from "@apollo/client"
import { useRef, useState } from "react"
import { CREATE_COMMENT, CREATE_REPLY, GET_COMMENTS, GET_LIKED_COMMENT, GET_REPLY, LIKE_COMMENT, UNLIKE_COMMENT } from "../../lib/queryPost"
import { Add, Reply } from "../../lib/symbols/add"
import { Liked, Likes } from "../../lib/symbols/Hearth"
import "../../stylings/comment.scss"
import { UserPostView } from "./UserPostView"

export const CommentComponent: React.FC<{user:any, post:any}> = ({user, post})=>{

    const [addComment] = useMutation(CREATE_COMMENT);
    const [limit, setLimit] = useState(2);
    const [fetch, setFetch] = useState(false);
    const {loading, error, data, refetch} = useQuery(GET_COMMENTS, {variables:{
        postid:post.id,
        limit:limit,
    }})

    if(fetch){
        refetch();
        setFetch(false);
    }

    const contentRef = useRef<HTMLInputElement>(null);

    function handleAddComment(){
        let contentText = contentRef.current?.value;

        if(contentText === ""){
            alert("please fill the comment");
            return;
        }

        addComment({variables:{
            userid:user.id,
            postid:post.id,
            content:contentText
        }}).then(()=>{
            refetch();
            
        }).catch((err)=>{
            console.log(err)
        })
    }

    return <div className="comment-container">
        <hr />
        <div className="create-container">
            <input ref={contentRef} className="text" id="comment-input" type="text" placeholder="Comment"/>

            <div className="flex items-center" id="btn-add" onClick={handleAddComment}>
                <p className="text">Add</p>
                <Add/>
            </div>
        </div>

        {!loading && data.comments.map((comment:any)=>{
            return <Comment comment={comment} user={user} setFetch={setFetch}/>
        })}

        {loading && <div>loading..</div>}
        {!loading && limit <= post.comments && <div className="text" id="btn-load-more" onClick={()=>{
            let newLimit = limit + 2;
            setLimit(newLimit);
            refetch();
        }}>Load More</div>}
    </div>
}


const Comment:React.FC<{comment:any, user:any, setFetch:Function}> = ({comment, user, setFetch})=>{
    const [likeComment] = useMutation(LIKE_COMMENT);
    const [unlikeComment] = useMutation(UNLIKE_COMMENT);
    const [show, setShow] = useState(false);
    
    const [addReply] = useMutation(CREATE_REPLY);
    
    const contentRef = useRef<HTMLInputElement>(null);
    
    const [like, setLike] = useState<any>(undefined);
    const {loading, data, error, refetch} = useQuery(GET_LIKED_COMMENT, {variables:{
        userid: user.id,
        commentid: comment.id,
    }});

    const [fetchReply, setFetchReply] = useState(false);

    if(!loading){
        if(data.likedComments.length <= 0 && like === undefined){
            setLike(false);
        } else if(data.likedComments.length > 0 && like === undefined) {
            setLike(true);
        }
    }

    function handleLike(){
        if(like){
            unlikeComment({variables:{
                userid: user.id,
                commentid: comment.id
            }}).then(()=>{
                setLike(false);
                refetch();
                setFetch(true);
            }).catch((err)=>{
                console.log(err);
            })
        } else if(!like){
            likeComment({variables:{
                userid: user.id,
                commentid: comment.id
            }}).then(()=>{
                setLike(true);
                refetch();
                setFetch(true);
            }).catch((err)=>{
                console.log(err);
            })
        }
    }

    function handleAddReply(){
        let contentText = contentRef.current?.value;

        if(contentText === ""){
            alert("please fill the comment");
            return;
        }

        addReply({variables:{
            userid:user.id,
            postid:comment.post_id,
            content:contentText,
            commentid:comment.id,
        }}).then(()=>{
            setFetchReply(true);
            
        }).catch((err)=>{
            console.log(err)
        })
    }

    return <div key={comment.id} className="comment-content">
        <div className="header-comment">
            <UserPostView userid={comment.user_id} type={"comment"}/>
            <div className="like-counter">
                <p className="text" id="counter">{comment.likes - 1}</p>
                <div onClick={handleLike}>
                    {like ? <Liked/>: <Likes/>}
                </div>
            </div>
        </div>
        <hr />
        <div className="footer-comment">
            <p className="text" id="comment-content">{comment.content}</p>
            <div className="flex items-center" id="btn-reply" onClick={()=>{
                if(show) setShow(false);
                else setShow(true);
            }}>
                <p className="text">reply</p>
                <Reply/>
            </div>
        </div>
        {show && <hr/>}
        {show && <div className="create-container">
            <input ref={contentRef} className="text" id="comment-input" type="text" placeholder="Comment"/>

            <div className="flex items-center" id="btn-add" onClick={handleAddReply}>
                <p className="text">Add</p>
                <Add/>
            </div>
        </div>}
        <Replys comment={comment} fetch={fetchReply} setFetch={setFetchReply}/>
    </div>
}

const Replys:React.FC<{comment:any,fetch:boolean, setFetch:Function}> = ({comment, fetch, setFetch})=>{

    const [limit, setLimit] = useState(1);

    const {loading, data, error, refetch} = useQuery(GET_REPLY,{variables:{
        postid: comment.post_id,
        commentid: comment.id,
        limit:limit
    }});

    if(fetch){
        refetch();
        setFetch(false);
    }

    return <div className="reply-container">
        <p className="text" id="title">Replys</p>
        {!loading && data.replyComments.map((reply:any)=>{
            return <ReplyItem reply={reply} setFetch={setFetch}/>
        })}

        {loading && <div>loading..</div>}
        <div className="btn-div">
            {!loading && data.replyComments.length >0 && <div className="text" id="btn-reply-more" onClick={()=>{
                let newLimit = limit + 2;
                setLimit(newLimit);
                refetch();
            }}>More</div>}
        </div>
    </div>
}

const ReplyItem:React.FC<{reply:any, setFetch:Function}> = ({reply, setFetch})=>{
    const [like, setLike] = useState<any>(undefined);
    const {loading, data, error, refetch} = useQuery(GET_LIKED_COMMENT, {variables:{
        userid: reply.user_id,
        commentid: reply.id,
    }});

    const [likeComment] = useMutation(LIKE_COMMENT);
    const [unlikeComment] = useMutation(UNLIKE_COMMENT);

    if(!loading){
        if(data.likedComments.length <= 0 && like === undefined){
            setLike(false);
        } else if(data.likedComments.length > 0 && like === undefined) {
            setLike(true);
        }
    }

    function handleLike(){
        if(like){
            unlikeComment({variables:{
                userid: reply.user_id,
                commentid: reply.id,
            }}).then(()=>{
                setLike(false);
                refetch();
                setFetch(true);
            }).catch((err)=>{
                console.log(err);
            })
        } else if(!like){
            likeComment({variables:{
                userid: reply.user_id,
                commentid: reply.id,
            }}).then(()=>{
                setLike(true);
                refetch();
                setFetch(true);
            }).catch((err)=>{
                console.log(err);
            })
        }
    }

    return <div key={reply.id} className="reply-content">
        <div className="header-comment">
            <UserPostView userid={reply.user_id} type={"comment"}/>
            <div className="like-counter">
                <p className="text" id="counter">{reply.likes - 1}</p>
                <div onClick={handleLike}>
                    {like ? <Liked/>: <Likes/>}
                </div>
            </div>
        </div>
        <hr />
        <div className="footer-comment">
            <p className="text" id="comment-content">{reply.content}</p>
            
        </div>
    </div>
}