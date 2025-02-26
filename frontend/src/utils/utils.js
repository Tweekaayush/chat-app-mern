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

export const getTimestamp = (created) =>{
    const timeNow = new Date().getTime()
    const createdTime = new Date(created).getTime()
    const timeDiff = (timeNow - createdTime)/1000
    if(timeDiff < 60){
        return 'just now'
    }else if(timeDiff < (60 * 60)){
        let timestamp = Math.floor(timeDiff/60)
        return `${timestamp} minute${timestamp>1?'s':''} ago`
    }else if(timeDiff < (24*60*60)){
        let timestamp = Math.floor(timeDiff/(60*60))
        return `${timestamp} hour${timestamp>1?'s':''} ago`
    }else if(timeDiff < (24*60*60*30)){
        let timestamp = Math.floor(timeDiff/(60*60*24))
        return `${timestamp} day${timestamp>1?'s':''} ago`
    }else if(timeDiff < (365 * 24 * 60 * 60)){
        let timestamp = Math.floor(timeDiff/(60*60*24*365))
        return `${timestamp} year${timestamp>1?'s':''} ago`
    }
}

export const commonGroups = (chatList, users)=>{

    const commonGroups = chatList.filter(chat=>{
        if(!chat.isGroupChat) return false
        let f1 = false
        let f2 =false
        chat?.users?.forEach(user=>{
            if(user._id === users[0]._id) f1 = true
            if(user._id === users[1]._id) f2 = true
        })
        return f1 && f2
    })

    return commonGroups
}