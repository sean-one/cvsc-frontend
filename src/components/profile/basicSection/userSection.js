import React, { useContext } from 'react';

import { UsersContext } from '../../../context/users/users.provider';

import TabHeader from '../sectionComponents/tabHeader';
import UserAvatar from './userAvatar';
import ContactSection from '../../contact/contactSection';


const UserSection = (props) => {
    const { userProfile } = useContext(UsersContext)

    return (
        <div className='userSection'>
            <TabHeader title='User Profile' viewable={props.viewable} toggleView={props.toggleView} />
            <div className={props.viewable ? 'userProfile' : 'inactive'}>
                <div className='userDetails'>
                    <div className='username'>
                        <h3>{userProfile['username']}</h3>
                    </div>
                    <UserAvatar />
                </div>
                <ContactSection />
            </div>
        </div>
    )
}

export default UserSection;