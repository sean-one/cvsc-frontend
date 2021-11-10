import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft, faCamera, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

import { UsersContext } from '../../../../context/users/users.provider';

import ContactSection from './contactSection/contactSection';
import InstagramContact from './instagramContact/instagramContact';

import './userSection.css';

const UserSection = (props) => {
    const [ loading, setLoading ] = useState(true)
    const { userProfile, userContact, setUserContact } = useContext(UsersContext)

    useEffect(() => {
        if (userProfile.contact_id) {
            AxiosInstance.get(`/contacts/${userProfile.contact_id}`)
                .then(contact => {
                    setUserContact(contact.data)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [])

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
                        <h3>{userProfile.username}</h3>
                    </div>
                    <div className='userAvatar'>
                        <img src={userProfile.avatar} alt='user profile' />
                        <FontAwesomeIcon id='userAvatarEdit' icon={faCamera} size='2x' />
                    </div>
                </div>
                {
                    loading ? (
                        <div> ...loading data... </div>
                    ) : (
                        <ContactSection />
                        // <div className='contacts'>
                        //     <div className='socialList'>
                        //         <div className='user_email'>
                        //             <FontAwesomeIcon className='tabIcon' icon={faEnvelope} size='1x' />
                        //             <p>{userProfile.email}</p>
                        //         </div>
                        //         {
                        //             userContact['instagram'] ? (
                        //                 <p>{userContact['instagram']}</p>
                        //                 ) : (
                        //                 <InstagramContact />
                        //             )
                        //         }
                        //     </div>
                        // </div>
                    )
                }
            </div>
        </div>
    )
}

export default UserSection;