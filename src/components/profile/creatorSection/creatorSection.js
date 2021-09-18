import React, { useContext } from 'react';

import { UsersContext } from '../../../context/users/users.provider';

import CreatorRequestForm from './creatorRequestForm/creatorRequestForm';

import './creatorSection.css';

const CreatorSection = (props) => {
    const { userEvents } = useContext(UsersContext)

    return (
        <div className='creatorSection'>
            <CreatorRequestForm />
            {
                userEvents.map(event => {
                    return (
                        <div key={event.id}>
                            <p>{event.eventname}</p>
                            <p>{event.eventdate}</p>
                            <p>{event.venue_name}</p>
                            <p>edit</p>
                            <p>delete</p>
                        </div>
                    )
                })
            }
            <p>you have creator rights!</p>
        </div>
    )
}

export default CreatorSection;