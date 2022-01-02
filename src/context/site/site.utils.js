export const userSignIn = (user) => {
    user.user = { id: user['id'], username: user['username'], avatar: user['avatar'], contact_id: user['contact_id'] }
    localStorage.setItem('token', user.token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('avatar', user.avatar)
    localStorage.setItem('user', JSON.stringify(user.user))
    localStorage.setItem('contact', JSON.stringify(user.contact))
    localStorage.setItem('isLoggedIn', true)
}