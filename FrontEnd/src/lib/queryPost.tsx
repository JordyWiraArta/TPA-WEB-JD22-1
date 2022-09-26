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
