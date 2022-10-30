
export const removeFromArray = (removeId, currentArr) => {
    console.log(removeId)
    console.log(currentArr)
    return currentArr.filter(event => event.event_id !== removeId)
}

export const userSignIn = (user) => {
    user.user = {
        id: user['id'],
        username: user['username'],
        avatar: user['avatar'],
        email: user['email']
    }
    // localStorage.setItem('token', user.token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('user', JSON.stringify(user.user))
    localStorage.setItem('isLoggedIn', true)
}

export const userUpdate = (user) => {
    user.user = {
        id: user['id'],
        username: user['username'],
        avatar: user['avatar'],
        email: user['email']
    }
    localStorage.setItem('userId', user.id)
    localStorage.setItem('user', JSON.stringify(user.user))
}