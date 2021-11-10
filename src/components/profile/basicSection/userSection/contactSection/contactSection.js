import React, { useState, useContext, useEffect } from 'react';
import AxiosInstance from '../../../../../helpers/axios';

import { UsersContext } from '../../../../../context/users/users.provider';

import './contactSection.css'

const ContactSection = (props) => {
    const [ loading, setLoading ] = useState(true)
    const { userProfile, userContact, setUserContact } = useContext(UsersContext)

    useEffect(() => {
        if (userProfile['contact_id']) {
            AxiosInstance.get(`/contacts/${userProfile['contact_id']}`)
                .then(contact => {
                    setUserContact(contact.data)
                    setLoading(false)
                    console.log(contact)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className='contactWrapper'>
            {
                loading ? (
                    <div> ...loading contact... </div>
                ) : (
                    <div>{JSON.stringify(userContact)}</div>
                )
            }
        </div>
    )
}

export default ContactSection;