import React from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import { MenuLinks } from '../helpers/menu.links';

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
    const { auth, logout_user } = useAuth()
    let navigate = useNavigate()

    const navMenuClick = (linkto) => {
        toggle(false)
        navigate(MenuLinks[linkto].link)
    }

    const logOutUser = async () => {
        const logoutResponse = await AxiosInstance.get('/auth/logout')
        
        if(logoutResponse.status === 204) {
            toggle(false)
            logout_user()
            navigate('/')
        }
    }


    return (
        <MenuStyles>
            <div className='menuWrapper' onClick={() => toggle(false)}>
                <div className='navMenu'>
                    <div className='navMenuButtons' onClick={() => navMenuClick('home')}>calendar</div>
                    {
                        (Object.keys(auth).length > 0)
                            ? <div className='navMenuButtons' onClick={() => navMenuClick('profile')}>profile</div>
                            : <div className='navMenuButtons' onClick={() => navMenuClick('register')}>register</div>
                        
                    }
                    {
                        (auth?.user?.account_type >= process.env.REACT_APP_BASIC_ACCOUNT) &&
                            <div className='navMenuButtons' onClick={() => navMenuClick('new_business')}>create business</div>
                    }
                    {
                        (auth?.user?.account_type >= process.env.REACT_APP_CREATOR_ACCOUNT) &&
                            <div className='navMenuButtons' onClick={() => navMenuClick('new_event')}>create event</div>

                    }
                    {
                        (Object.keys(auth).length > 0)
                            ? <div className='navMenuButtons' onClick={() => logOutUser()}>logout</div>
                            : <div className='navMenuButtons' onClick={() => navMenuClick('login')}>login</div>
                    }
                </div>
            </div>
        </MenuStyles>
    )
}

export default Menu;