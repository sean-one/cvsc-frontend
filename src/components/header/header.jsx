import React, { useState } from 'react';

import Menu from '../navigation/menu';
import './header.css';

const Header = () => {
    const [ activeMenu, setActiveMenu ] = useState(false)

    const toggleMenu = () => {
        setActiveMenu(!activeMenu);
    }
    return (
        <div className='header'>
            <div className='branding'>CVSC</div>
            <div className='menu' onClick={toggleMenu}>|||</div>
            <div className={activeMenu ? 'menubar' : 'inactive'}>
                <Menu toggle={toggleMenu}/>
            </div>
        </div>
    )
}

export default Header;