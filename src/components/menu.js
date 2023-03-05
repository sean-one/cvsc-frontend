import React from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../helpers/axios';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import { MenuLinks } from '../helpers/menu.links';

const Styles = styled.div`
    .menuWrapper {
        position: absolute;
        top: 4.5rem;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0,0,0,0.6);
    }
    
    .navMenu {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #0D2B12;
        border-radius: 0 0 15px 15px;
        box-shadow: 5px 5px 5px #010a00;
    }

    .navMenuButtons {
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
        <Styles>
            <div className='menuWrapper' onClick={() => toggle(false)}>
                <div className='navMenu'>
                    <button className='navMenuButtons' onClick={() => navMenuClick('home')}>calendar</button>
                    {
                        (Object.keys(auth).length > 0)
                            ? <button className='navMenuButtons' onClick={() => navMenuClick('profile')}>profile</button>
                            : <button className='navMenuButtons' onClick={() => navMenuClick('register')}>register</button>
                        
                    }
                    {
                        (auth?.user?.account_type >= process.env.REACT_APP_BASIC_ACCOUNT) &&
                            <button className='navMenuButtons' onClick={() => navMenuClick('new_business')}>create business</button>
                    }
                    {
                        (auth?.user?.account_type >= process.env.REACT_APP_CREATOR_ACCOUNT) &&
                            <button className='navMenuButtons' onClick={() => navMenuClick('new_event')}>create event</button>

                    }
                    {
                        (Object.keys(auth).length > 0)
                            ? <button className='navMenuButtons' onClick={() => logOutUser()}>logout</button>
                            : <button className='navMenuButtons' onClick={() => navMenuClick('login')}>login</button>
                    }
                </div>
            </div>
        </Styles>
    )
}

export default Menu;