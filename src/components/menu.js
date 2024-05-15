import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaPlus } from 'react-icons/fa6';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import { useUserAccountRole } from '../hooks/useRolesApi';

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
        font-family: var(--header-font);
        width: 100%;
        height: 100vh;
        display: grid;
        justify-content: center;
        align-content: center;
        background-color: var(--opacity);
        color: var(--text-color);
        padding-bottom: 10rem;
    }

    .navMenuButtons {
        text-align: center;
        cursor: pointer;
        padding: 2rem;
    }
`;

const Menu = ({ toggle }) => {
    const { isLoggedIn, auth, setAuth } = useAuth();
    const { dispatch } = useNotification();
    const { data: user_account_role } = useUserAccountRole(auth?.user?.id)
    const { themeName, toggleTheme } = useTheme()
    let navigate = useNavigate();

    const logOutUser = async () => {
        try {
            const username = auth?.user?.username || 'user';
            const logoutResponse = await AxiosInstance.get('/auth/logout')
            
            if(logoutResponse.status === 204) {
                localStorage.removeItem('jwt');
                localStorage.removeItem('isMfaVerified');
                setAuth(null)

                toggle(false)

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${username} successfully logged out`
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
                    <div className='navMenuButtons menuText' onClick={() => navigate('/')}>Calendar</div>
                    {   (isLoggedIn && (user_account_role?.data?.role_type !== 'basic')) &&
                            <div className='navMenuButtons menuText' onClick={() => navigate('/event/create')}><FaPlus className='siteIcons'/> Event</div>
                    }
                    <div className='navMenuButtons menuText' onClick={() => navigate('/businesses')}>Businesses</div>
                    {
                        (isLoggedIn && auth?.user?.email_verified) &&
                            <div className='navMenuButtons menuText' onClick={() => navigate('/business/create')}><FaPlus className='siteIcons'/> Business</div>
                    }
                    {
                        isLoggedIn
                            ? <div className='navMenuButtons menuText' onClick={() => navigate('/profile')}>Profile</div>
                            : <div className='navMenuButtons menuText' onClick={() => navigate('/register')}>Register</div>
                    }
                    {
                        isLoggedIn
                            ? <div className='navMenuButtons menuText' onClick={() => logOutUser()}>Logout</div>
                            : <div className='navMenuButtons menuText' onClick={() => navigate('/login')}>Login</div>
                    }
                    <div className='navMenuButtons menuText' onClick={() => toggleTheme()}>{themeName === 'light' ? <FaMoon className='siteIcons' /> : <FaSun className='siteIcons' />} Theme</div>
                </div>
            </div>
        </MenuStyles>
    );
}


export default Menu;