import { gql } from "@apollo/client";

export const CREATE_POST = gql`
mutation makePost($userid:ID!, $urlType: String!, $content: String!, $url:String!){
    createPost(userId:$userid, type:$urlType, content:$content, url:$url){
      id
    }
  }
`

export const GET_POSTS = gql`
query getPost($limit:Int!){
    posts(number:$limit){
    id
    content_text
    user_id
    type
    url
    likes
    comments
    }
  }
`

export const CREATE_JOB_POST = gql`
mutation MakeJobOffer($input: newJobPost!){
  createJobPost(input:$input){
    id
  }
}
`

export const GET_JOB_POSTS = gql`
query getJobPosts{
  jobPosts{
    id
    job_name
    company_name
    logo_url
    location
  }
}
`

export const LIKES = gql`
mutation like($userid:ID!, $postid:ID!){
  likePost(user_id:$userid, post_id:$postid){
    post_id
  }
}
`

export const GET_LIKED = gql`
query getLiked($userid: ID!, $postid:ID!){
  likedPosts(user_id:$userid, post_id:$postid){
    post_id
  }
}
`

export const UNLIKE = gql`
mutation unlike($userid:ID!, $postid:ID!){
  unlikePost(user_id:$userid, post_id:$postid){
    post_id
  }
}
`

export const CREATE_COMMENT = gql`
mutation createComment($userid:ID!, $postid:ID!, $content:String!){
  createComment(user_id:$userid, post_id:$postid, content:$content){
    id
  }
}
`

export const CREATE_REPLY = gql`
mutation createReply($userid:ID!, $postid:ID!, $content:String!, $commentid:ID!){
  createReplyComment(user_id:$userid, post_id:$postid, content:$content, comment_id:$commentid){
    id
  }
}
`

export const GET_COMMENTS = gql`
query getComments($postid:ID!, $limit:Int!){
  comments(post_id:$postid, number:$limit){
    id
    post_id
    content
    user_id
    reply_id
    likes
  }
}
`

export const GET_REPLY = gql`
query getReply($postid:ID!, $commentid:ID!, $limit:Int!){
  replyComments(post_id:$postid, comment_id:$commentid, number:$limit){
    id
    post_id
    content
    user_id
    reply_id
    likes
  }
}
`

export const LIKE_COMMENT = gql`
mutation likingComment($userid:ID!, $commentid:ID!){
  likeComment(user_id:$userid, comment_id:$commentid){
    comment_id
  }
}
`

export const UNLIKE_COMMENT = gql`
mutation unlikingComment($userid:ID!, $commentid:ID!){
  unlikeComment(user_id:$userid, comment_id:$commentid){
    comment_id
  }
}
`

export const GET_LIKED_COMMENT = gql`
query getLikedComment($userid:ID!, $commentid:ID!){
  likedComments(user_id:$userid, comment_id:$commentid){
    user_id
  }
}
`


