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

export const GET_INVITATION = gql`
query getNetworkRequest($userid:ID!, $dstid:ID!){
  userInvitations(user_id:$userid, dst_id: $dstid){
    id
    user_src_id
    user_dst_id
    message
  }
}
`

export const GET_MY_INVITATION = gql`
query getMyNetworkRequest($dstid:ID!){
  myInvitations(dst_id: $dstid){
    id
    user_src_id
    user_dst_id
    message
  }
}
`

export const GET_FOLLOWED_USERS = gql`
query getFollowedUsers($userid:ID!){
  follows(user_id:$userid){
    followed_id
  }
}
`

export const GET_FOLLOWERS = gql`
query getFollowers($userid:ID!){
  followers(user_id:$userid){
    user_id
  }
}
`

export const GET_CONNECTIONS = gql`
query getConnections($userid:ID!){
  connects(user_id:$userid){
    user_id
    connected_id
  }
}
`

export const FOLLOW_USER = gql`
mutation followUser($userid:ID!, $followid:ID!){
  follow(user_id:$userid, follow_id:$followid){
    followed_id
    
  }
}
`

export const SEND_INVITATION = gql`
mutation sendInvitation($userid:ID!, $connectid:ID!, $message:String!){
	sendInvitation(user_id:$userid, connecting_id:$connectid, message:$message){
    id
  }
}
`

export const CONNECT_USER = gql`
mutation connectUser($userid:ID!, $connectid:ID!){
	connect(user_id:$userid, connected_id:$connectid){
    user_id
  }
}
`

export const REJECT_REQUEST = gql`
mutation rejectRequest($id:ID!){
  rejectInvitation(id:$id){
    id
  }
}
`

export const ADD_VIEWS = gql`
mutation addViews($userid:ID!){
  addViewUser(user_id:$userid){
    views
  }
}
`