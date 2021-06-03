import React from 'react';
import { Link } from 'react-router-dom';

import './menu.css';

const Menu = (props) => {
    return (
        <ul className='menuListWrapper'>
            <Link to={{
                pathname: '/calendar'
            }}>
                <li onClick={props.toggle}>Calendar</li>
            </Link>
            <Link to={{
                pathname: '/login'
            }}>
                <li onClick={props.toggle}>Login</li>
            </Link>
        </ul>
    )
}

export default Menu;