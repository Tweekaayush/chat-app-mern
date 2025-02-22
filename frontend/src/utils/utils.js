export const getSender = (loggedInUser, users) =>{
    return loggedInUser === users[0]._id? users[1].name:users[0].name
}

export const getSenderImage = (loggedInUser, users)=>{
    return loggedInUser === users[0]._id?users[1]?.profile_img?.url:users[1]?.profile_img?.url
}