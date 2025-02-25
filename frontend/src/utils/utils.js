export const getSender = (loggedInUser, users) =>{
    return loggedInUser === users[0]._id? users[1].name:users[0].name
}

export const getSenderId = (loggedInUser, users) =>{
    return loggedInUser === users[0]._id? users[1]._id:users[0]._id
}

export const getSenderImage = (loggedInUser, users)=>{
    return loggedInUser === users[0]._id?users[1]?.profile_img?.url:users[1]?.profile_img?.url
}

export const getSenderStatus = (loggedInUser, users) =>{
    return loggedInUser === users[0]._id? users[1].status:users[0].status   
}