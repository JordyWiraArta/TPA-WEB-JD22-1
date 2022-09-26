import { gql } from "@apollo/client";

export const INSERT_EXPERIENCE = gql`
mutation insertExperience($input:inputExp!){
    addExp (input:$input){
      id
    }
  }
`

export const INSERT_EDUCATION = gql`
mutation insertEducation($input:inputEdu!){
    addEdu (input:$input){
      id
    }
  }
`

export const GET_EXPERIENCE = gql`
query getExperiences($id: ID!){
    userExperiences(user_id:$id){
      id
      user_id
      title
      employment_type
      company_name
      location
      start_date
      end_date
    }
  }
`

export const GET_EDUCATION = gql`
query getEducations($id: ID!){
    userEducations(user_id:$id){
         id
      user_id
      school 
      degree
      field_of_study
      start_date
      end_date
    }
  }
`

export const UPDATE_EDUCATION = gql`
mutation updateEducation($id: ID!, $input: inputEdu!){
  updateUserEdu(id:$id, input: $input){
    school
  }
}
`

export const UPDATE_EXPERIENCE = gql`
mutation updateExperience($id: ID!, $input:inputExp!){
  updateUserExp(id:$id, input:$input){
    title
  }
}
`