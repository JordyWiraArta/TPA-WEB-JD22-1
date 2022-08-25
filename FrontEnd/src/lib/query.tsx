import { gql } from "@apollo/client";

export const GET_ALL_USERS= gql`
    query getUser{
        users{
            id
            first_name
            email
            password
            profile_photo
            background_photo
            headline
            job
        }
    }
`

export const GET_CURR_USER = gql`
    query getCurrUser($id:ID!){
        currUser(user_id:$id){
            id
            first_name
            last_name
            email
            password
            profile_photo
            background_photo
            headline
            job
        }
    }
`

export const CREATE_NEW_USER = `
    mutation register($first_name: String!, $last_name:String!, $email: String!, $password:String!, $job:String!){
            createUser(input:{
            first_name: $first_name
            last_name: $last_name
            email: $email
            password: $password
            job: $job
        }){
            id
        }
    }
`
