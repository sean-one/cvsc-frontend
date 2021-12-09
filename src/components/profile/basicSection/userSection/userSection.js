import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../../context/users/users.provider';

import UserAvatar from './userAvatar/userAvatar';
import ContactSection from '../../../contact/contactSection';

import './userSection.css';

const UserSection = (props) => {
    const { userProfile } = useContext(UsersContext)

    return (
        <div className='userSection'>
            <div className='tabHeader'>
                <p>User Profile</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
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