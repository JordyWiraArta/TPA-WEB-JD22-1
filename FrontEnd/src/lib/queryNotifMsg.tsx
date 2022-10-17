import { gql } from "@apollo/client";


export const CREATE_NOTIF = gql`
mutation createNotif($src_id:ID!, $content:String!){
    addNotification(src_id:$src_id, content:$content){
      user_id
      src_id
      content
    }
  }
`

export const GET_MY_NOTIFICATION = gql`
query getMyNotif($user_id:ID!){
    myNotifications(user_id:$user_id){
      user_id
      src_id
      content
    }
  }
`