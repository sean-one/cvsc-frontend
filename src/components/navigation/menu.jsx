import React from 'react';
import { Link } from 'react-router-dom';

import './menu.css';

const Menu = () => {
    return (
        <ul className='menuListWrapper'>
            <Link to={{
                pathname: '/calendar'
            }}>
                <li>Calendar</li>
            </Link>
            <Link to={{
                pathname: '/login'
            }}>
                <li>Login</li>
            </Link>
        </ul>
    )
}

export default Menu;