import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

const MenuStyles = styled.div`
    .menuWrapper {
        position: absolute;
        top: var(--header-height);
        left: 0;
        width: 100%;
        height: 100vh;
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
        color: #006633;
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

    #themeIcon {
        margin-right: 1rem;
    }

    .navMenuButtons:hover {
        border: none;
    }
`;

const Menu = ({ toggle }) => {
    const { isLoggedIn, setAuth } = useAuth();
    const { dispatch } = useNotification();
    const { themeName, toggleTheme } = useTheme()
    let navigate = useNavigate();

    const logOutUser = async () => {
        try {
            const logoutResponse = await AxiosInstance.get('/auth/logout')
            
            if(logoutResponse.status === 204) {
                localStorage.removeItem('jwt')
                setAuth(null)

                toggle(false)

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'logged out super like'
                    }
                })

                navigate('/')
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


    return (
        <MenuStyles>
            <div className='menuWrapper' onClick={() => toggle(false)}>
                <div className='navMenu'>
                    <div className='navMenuButtons' onClick={() => navigate('/')}>Calendar</div>
                    <div className='navMenuButtons' onClick={() => navigate('/businesses')}>Businesses</div>
                    {
                        isLoggedIn
                            ? <div className='navMenuButtons' onClick={() => navigate('/profile')}>Profile</div>
                            : <div className='navMenuButtons' onClick={() => navigate('/register')}>Register</div>
                    }
                    {
                        isLoggedIn &&
                            <div className='navMenuButtons' onClick={() => navigate('/business/create')}>Create Business</div>
                    }
                    {   isLoggedIn &&
                            <div className='navMenuButtons' onClick={() => navigate('/event/create')}>Create Event</div>
                    }
                    {
                        isLoggedIn
                            ? <div className='navMenuButtons' onClick={() => logOutUser()}>Logout</div>
                            : <div className='navMenuButtons' onClick={() => navigate('/login')}>Login</div>
                    }
                    <div className='navMenuButtons' onClick={() => toggleTheme()}><FontAwesomeIcon icon={themeName === 'light' ? faMoon : faSun} id='themeIcon' />Theme</div>
                </div>
            </div>
        </MenuStyles>
    );
}


export default Menu;