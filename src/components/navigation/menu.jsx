import React from 'react';
import { Link } from 'react-router-dom';

import './menu.css';

const Menu = (props) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    return (
        <ul className='menuListWrapper'>
            <Link to={{
                pathname: '/calendar'
            }}>
                <li onClick={props.toggle}>Calendar</li>
            </Link>
            {
                (isLoggedIn === 'false' || isLoggedIn === null)
                    && <Link to={{
                            pathname: '/register'
                        }}>
                            <li onClick={props.toggle}>Register</li>
                        </Link>
            }
            {
                (isLoggedIn === 'true')
                    && <Link to={{
                            pathname: '/profile',
                            // state: {
                            //     state
                            // }
                        }}>
                            <li onClick={props.toggle}>Profile</li>
                        </Link>
            }
            {
                (isLoggedIn === 'true')
                    && <Link to={{
                            pathname: '/events/create'
                        }}>
                            <li onClick={props.toggle}>Create Event</li>
                        </Link>
            }
            {
                (isLoggedIn === 'true')
                    ? <Link to={{
                        pathname: '/calendar'
                    }}>
                        <li onClick={props.logout}>Logout</li>
                    </Link>
                    : <Link to={{
                        pathname: '/login'
                    }}>
                        <li onClick={props.toggle}>Login</li>
                    </Link>
            }
        </ul>
    )
}

export default Menu;