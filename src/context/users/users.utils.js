
export const removeFromArray = (removeId, currentArr) => {
    console.log(removeId)
    console.log(currentArr)
    return currentArr.filter(event => event.event_id !== removeId)
}

export const userSignIn = (user) => {
    user.user = { id: user['id'], username: user['username'], avatar: user['avatar'], contact_id: user['contact_id']}
    localStorage.setItem('token', user.token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('avatar', user.avatar)
    localStorage.setItem('user', JSON.stringify(user.user))
    localStorage.setItem('contact', JSON.stringify(user.contact))
    localStorage.setItem('isLoggedIn', true)
}

export const userUpdate = (user) => {
    user.user = { id: user['id'], username: user['username'], avatar: user['avatar'], contact_id: user['contact_id']}
    localStorage.setItem('userId', user.id)
    localStorage.setItem('avatar', user.avatar)
    localStorage.setItem('user', JSON.stringify(user.user))
}

export const userContactUpdate = (contact) => {
    localStorage.setItem('contact', JSON.stringify(contact))
}