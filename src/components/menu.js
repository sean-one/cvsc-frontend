import React from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

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
        position: absolute;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--opacity);
        /* background-color: var(--main-color); */
        /* color: var(--trim-color); */
        color: var(--secondary-color);
        padding-bottom: 15rem;
        border-radius: 0 0 15px 15px;
    }

    .navMenuButtons {
        padding: 1.5rem;
        font-size: var(--header-font-size);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
        border: none;
    }

    .navMenuButtons:hover {
        border: none;
    }
`;

const Menu = ({ toggle }) => {
    const { user_logout, isLoggedIn } = useAuth();
    const { dispatch } = useNotification();
    let navigate = useNavigate();

    const navMenuClick = (link) => {
        toggle(false)
        navigate(link)
    }

    const logOutUser = async () => {
        try {
            const logoutResponse = await AxiosInstance.get('/auth/logout')
            
            if(logoutResponse.status === 204) {
                toggle(false)
                user_logout()
            }

        } catch (error) {
            if(error?.response?.status === 400) {
                toggle(false)
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            }
        }

    }

    const menuItems = [
        { label: 'Calendar', link: '/' },
        { label: 'Businesses', link: '/businesses' },
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
            condition: () => isLoggedIn
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