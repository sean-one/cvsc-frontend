import React from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';

const MenuStyles = styled.div`
    .menuWrapper {
        position: absolute;
        top: var(--header-height);
        left: 0;
        width: 100%;
        height: 100vh;
        /* background-color: rgba(0,0,0,0.6); */
        background-color: var(--opacity);
    }
    
    .navMenu {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--main-color);
        color: var(--secondary-color);
        border-radius: 0 0 15px 15px;
    }

    .navMenuButtons {
        padding: 1rem;
        font-weight: bold;
        text-transform: capitalize;
        letter-spacing: 0.15rem;
        border: none;
    }

    .navMenuButtons:hover {
        border: none;
    }
`;

const Menu = ({ toggle }) => {
    const { auth, user_logout, isLoggedIn } = useAuth()
    let navigate = useNavigate()

    const navMenuClick = (link) => {
        toggle(false)
        navigate(link)
    }

    const logOutUser = async () => {
        const logoutResponse = await AxiosInstance.get('/auth/logout')
        
        if(logoutResponse.status === 204) {
            toggle(false)
            user_logout()
        }
    }

    const menuItems = [
        { label: 'Calendar', link: '/' },
        {
            label: () => isLoggedIn ? 'Profile' : 'Register',
            link: `${isLoggedIn ? '/profile' : '/register'}`
        },
        {
            label: 'Create Business',
            link: '/business/create',
            condition: () => isLoggedIn
        },
        {
            label: 'Create Event',
            link: '/event/create',
            condition: () => isLoggedIn && auth?.roles.some(role => role.active_role && role.role_type >= process.env.REACT_APP_CREATOR_ACCOUNT)
        },
        {
            label: () => isLoggedIn ? 'Logout' : 'Login',
            action: () => isLoggedIn ? logOutUser : () => navMenuClick('/login')
        }
    ];


    return (
        <MenuStyles>
            <div className='menuWrapper' onClick={() => toggle(false)}>
                <div className='navMenu'>
                    {menuItems.map((item, index) => {
                        const shouldDisplay = item.condition ? item.condition() : true;
                        if (shouldDisplay) {
                            return (
                                <div
                                    key={index}
                                    className='navMenuButtons'
                                    onClick={item.action ? item.action() : () => navMenuClick(item.link)}
                                >
                                    {typeof item.label === 'function' ? item.label() : item.label}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </MenuStyles>
    );
}


export default Menu;