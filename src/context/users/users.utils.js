
export const removeFromArray = (removeId, currentArr) => {
    console.log(removeId)
    console.log(currentArr)
    return currentArr.filter(event => event.event_id !== removeId)
}

export const userSignIn = (user) => {
    user.user = {
        id: user['id'],
        account_type: user['account_type'],
        username: user['username'],
        avatar: user['avatar'],
        email: user['email']
    }
    localStorage.setItem('token', user.token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('user', JSON.stringify(user.user))
    localStorage.setItem('isLoggedIn', true)
}

export const userUpdate = (user) => {
    user.user = { id: user['id'], account_type: user['account_type'], username: user['username'], avatar: user['avatar'], contact_id: user['contact_id']}
    localStorage.setItem('userId', user.id)
    localStorage.setItem('user', JSON.stringify(user.user))
}

export const findCreatorRights = (roles) => {
    const creatorIndex = roles.findIndex(role => {
        return role.role_type === 'creator'
    })
    if (creatorIndex >= 0) {
        return true
    } else {
        return false
    }
}

export const findAdminRights = (roles) => {
    const adminIndex = roles.findIndex(role => {
        return role.role_type === 'admin'
    })
    if (adminIndex >= 0) {
        return true
    } else {
        return false
    }
}

export const findManagerRights = (roles) => {
    const managerIndex = roles.findIndex(role => {
        return role.role_type === 'manager'
    })
    if (managerIndex >= 0) {
        return true
    } else {
        return false
    }
}