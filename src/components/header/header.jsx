// import React, { useState } from 'react';
import React, { useState, useContext } from 'react';

import Menu from '../navigation/menu';
import './header.css';

import UserContext from '../../context/userContext';

const Header = () => {
    const { userProfile } = useContext(UserContext);
    const [ activeMenu, setActiveMenu ] = useState(false)

    const toggleMenu = () => {
        setActiveMenu(!activeMenu);
    }

    const logout = () => {
        localStorage.clear()
        userProfile.avatar = "https://coachellavalleysmokers-images.s3.amazonaws.com/Coachella+Valley-01.png"
        // localStorage.removeItem('token');
        // localStorage.setItem('isLoggedIn', false);
        setActiveMenu(!activeMenu);
    }
    return (
        <div className='header'>
            <div className='profile'>
                <img className='profileImage' src={userProfile.avatar || "https://coachellavalleysmokers-images.s3.amazonaws.com/Coachella+Valley-01.png"} alt='user profile' />
            </div>
            <div className='branding'>C.V.S.C.</div>
            <div className='menu' onClick={toggleMenu}>|||</div>
            <div className={activeMenu ? 'menubar' : 'inactive'}>
                <Menu toggle={toggleMenu} logout={logout}/>
            </div>
        </div>
    )
}

export default Header;