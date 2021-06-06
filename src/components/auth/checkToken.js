import decode from 'jwt-decode';

const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.clear()
        localStorage.setItem('isLoggedIn', false);
        return false;
    }
    
    try {
        const { exp } = decode(token);
        
        if(exp < new Date().getTime() / 1000) {
            localStorage.clear()
            localStorage.setItem('isLoggedIn', false);
            return false
        }
    } catch (err) {
        localStorage.clear()
        localStorage.setItem('isLoggedIn', false);
        return false;
    }

    return true
}

export default checkToken;