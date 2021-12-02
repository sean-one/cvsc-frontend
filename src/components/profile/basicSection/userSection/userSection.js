import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faCamera } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../../context/users/users.provider';

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
                    <div className='userAvatar'>
                        <img src={userProfile['avatar']} alt='user profile' />
                        <FontAwesomeIcon id='userAvatarEdit' icon={faCamera} size='2x' />
                    </div>
                </div>
                <ContactSection />
            </div>
        </div>
    )
}

export default UserSection;