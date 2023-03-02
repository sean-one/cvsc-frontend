import React from 'react';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import { SimpleButton } from './menu/buttons/simple.button';
import { LogoutButton } from './menu/buttons/logout.button';

const Styles = styled.div`
    .menuWrapper {
        width: 100vw;
        color: #19381F;
        background-color: #909590;
        border-radius: 0 0 15px 15px;
    }
`;

const Menu = ({ toggle }) => { 
    const { auth } = useAuth()


    return (
        <Styles>
            <div className='menuWrapper'>
                <SimpleButton toggle={toggle} name='home' />
                {
                    (Object.keys(auth).length > 0)
                        ? <SimpleButton toggle={toggle} name='profile' />
                        : <SimpleButton toggle={toggle} name='register' />
                }
                {
                    (auth?.user?.account_type >= process.env.REACT_APP_BASIC_ACCOUNT) &&
                        <SimpleButton toggle={toggle} name='new_business' />
                }
                {
                    (auth?.user?.account_type >= process.env.REACT_APP_CREATOR_ACCOUNT) &&
                        <SimpleButton toggle={toggle} name='new_event' />
                }
                {
                    (Object.keys(auth).length > 0)
                        ? <LogoutButton toggle={toggle} />
                        : <SimpleButton toggle={toggle} name='login' />
                }
            </div>
        </Styles>
    )
}

export default Menu;