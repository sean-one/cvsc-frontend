
export const removeFromArray = (removeId, currentArr) => {
    console.log(removeId)
    console.log(currentArr)
    return currentArr.filter(event => event.event_id !== removeId)
}

export const createLocalUser = (userData) => {
    if(userData.business_roles.length <= 1) {
        userData.business_roles = [];
        localStorage.setItem('accounttype', 'basic')
    } else {
        localStorage.setItem('accounttype', 'editor')
    }
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.id)
    localStorage.setItem('isAdmin', userData.isAdmin)
    localStorage.setItem('avatar', userData.avatar)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', true)
}