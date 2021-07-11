import React, { useState } from 'react';
// import React, { useState, useContext } from 'react';

import Menu from '../navigation/menu';
import './header.css';

// import UserContext from '../../context/userContext';

const Header = () => {
    const [ activeMenu, setActiveMenu ] = useState(false)

    const toggleMenu = () => {
        setActiveMenu(!activeMenu);
    }

    const logout = () => {
        localStorage.clear()
        // localStorage.removeItem('token');
        // localStorage.setItem('isLoggedIn', false);
        setActiveMenu(!activeMenu);
    }
    return (
        <div className='header'>
            <div className='branding'>CVSC</div>
            <div className='menu' onClick={toggleMenu}>|||</div>
            <div className={activeMenu ? 'menubar' : 'inactive'}>
                <Menu toggle={toggleMenu} logout={logout}/>
            </div>
        </div>
    )
}

export default Header;