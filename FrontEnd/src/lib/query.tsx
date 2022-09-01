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
            education
            experience
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
            experience
            education
        }
    }
`

export const CREATE_NEW_USER = gql`
    mutation register($first_name: String!, $last_name:String!, $email: String!, $password:String!){
            createUser(input:{
            first_name: $first_name
            last_name: $last_name
            email: $email
            password: $password
        }){
            id
        }
    }
`

export const ACTIVATE_ACCOUNT = gql`
mutation setActive($code:String!){
    updateUser(id:"", code:$code, input:{
      first_name: "",
      last_name: "",
      experience: "",
      headline: "",
      password: "",
      email: "",
      background_photo: "",
      profile_photo: "",
      education: ""
    }){
        is_active
    }
  }
`

export const UPDATE_USER = gql`
    mutation updateUser($id:ID!, $input:updateUser!){
        updateUser(id:$id, code:"", input:$input){
        id
        first_name
        last_name
        email
        password
        education
        headline
        background_photo
        profile_photo
        experience
        }
    }
`

export const LOGIN = gql`
mutation authentication($email:String!, $password:String!){
    login(email:$email, password:$password){
      id
    }
  }
`

export const SEND_RESET_EMAIL = gql`
mutation resetEmail($email:String!){
    resetEmail(email:$email)
  }
`

export const RESET_PASSWORD = gql`
    mutation resetPassword($code:String!, $password:String!){
    updateUser(id:"reset", code:$code, input:{
      first_name: ""
      last_name: ""
      education: ""
      headline: ""
      password: $password
      email: ""
      background_photo: ""
      profile_photo: ""
      experience: ""
    }){
      email
    }
  } 
`
