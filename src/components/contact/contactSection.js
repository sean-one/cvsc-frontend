import React, { useContext } from 'react';
// import React, { useState, useContext } from 'react';
// import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
// import AxiosInstance from '../../helpers/axios'

import { UsersContext } from '../../context/users/users.provider';

import './contactSection.css'
import { ListGroup } from 'react-bootstrap';

const ContactSection = () => {
    // const [ editContact, setEditContact ] = useState(false)
    const { userContact } = useContext(UsersContext);
    // const { userContact, updateUserContact } = useContext(UsersContext);
    // const { register, handleSubmit, formState:{ errors } } = useForm({
    //     mode: 'onBlur',
    // })

    const contactIcons = {
        email: faEnvelope,
        instagram: faInstagramSquare
    }

    // const toggleEdit = () => {
    //     setEditContact(!editContact)
    // }

    // const updateContact = (data) => {
    //     // remove empty fields
    //     Object.keys(data).forEach(field => {
    //         if(data[field] === '') {
    //             delete data[field]
    //         }
    //     });
    //     const token = localStorage.getItem('token')
    //     AxiosInstance.post('/contacts/update', data, {
    //         headers: { 'Authorization': 'Bearer ' + token }
    //     })
    //         .then(response => {
    //             updateUserContact(response.data[0])
    //             setEditContact(false)
    //             // console.log(response.data)
    //         })
    //         .catch(err => console.log(err))
    // }

    return (
        <ListGroup>
            {
                Object.entries(userContact).map((contact, index) => {
                    if(!contact[1]) {
                        contact[1] = "Add Contact"
                    }
                    return (
                        <ListGroup.Item key={index} className='d-flex justify-content-start align-items-center'>
                            <FontAwesomeIcon className='m-2' icon={contactIcons[`${contact[0]}`]} size='1x' />
                            <p className='m-2' >{contact[1]}</p>
                            <FontAwesomeIcon className='m-2' icon={faEdit} size='1x' />
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
        // <div className='contactWrapper'>
        //     <form onSubmit={handleSubmit(updateContact)}>
        //         {
        //             Object.entries(userContact).map((contact, index) => {
        //                 if (!contact[1]) {
        //                     contact[1] = "Add Contact"
        //                     // console.log('missing')
        //                 }
        //                 return (
        //                     <div key={index} className='contacts'>
        //                         <FontAwesomeIcon className='tabIcon' key={index} icon={contactIcons[`${contact[0]}`]} size='1x' />
        //                         {
        //                             editContact ? (
        //                             <div className='networkInput'>
        //                                 <div className='inputWrapper'>
        //                                     <input {...register(`${contact[0]}`)} id={`${contact[0]}`} type='text' name={`${contact[0]}`} placeholder={contact[1]} />
        //                                 </div>
        //                                 <p className='errormessage'>{errors[`${contact[0]}`]?.message}</p>
        //                             </div>
        //                             ) : (
        //                                 <p>{contact[1]}</p>
        //                             )
        //                         }
        //                     </div>
        //                 )
        //             })
        //         }
        //         <p onClick={toggleEdit}>{editContact ? 'cancel' : 'edit'}</p>
        //         {
        //             editContact && (<input type='submit' value='submit' />)
        //         }
        //     </form>
        // </div>
    );
}

export default ContactSection;
