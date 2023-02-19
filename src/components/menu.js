import React from 'react';

import useAuth from '../hooks/useAuth';
import { SimpleButton } from './menu/buttons/simple.button';
import { LogoutButton } from './menu/buttons/logout.button';


const Menu = ({ toggle }) => {
    const { auth } = useAuth()


    return (
        <div className='w-100 bg-light'>
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
    )
}

export default Menu;