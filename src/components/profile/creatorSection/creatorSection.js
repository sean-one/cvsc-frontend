import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

import CreatorRequestForm from './creatorRequestForm/creatorRequestForm';
import EventPreview from '../../events/eventPreview';

import './creatorSection.css';
import '../profile.css';

import { UsersContext } from '../../../context/users/users.provider';

const CreatorSection = (props) => {
    const { userEvents } = useContext(UsersContext)
    const [ eventListVisable, setEventListVisable ] = useState(true);
    const [ requestFormVisable, setRequestFormVisable ] = useState(false)

    const toggleRequestForm = () => {
        setRequestFormVisable(!requestFormVisable)
    }

    return (
        <div className='creatorSection'>
            <CreatorRequestForm viewable={requestFormVisable} toggleView={toggleRequestForm}/>
            <div className='createNewEvent'>
                <Link to={{
                    pathname: '/events/create',
                    state: {
                        from: props.location.pathname
                    }
                }}>
                    <p>Create A New Event<span><FontAwesomeIcon icon={faPlus} size='1x' /></span></p>
                </Link>
            </div>
            {
                (eventListVisable) &&
                <div className='userEvents'>
                    {
                        userEvents.map(event => {
                            return (
                                <div key={event.event_id} className='adminWrapper'>
                                    <div className='eventdate'>
                                        <p>{format(new Date(event.eventdate), 'MMM d')}</p>
                                    </div>
                                    <div className='adminControls'>
                                        <Link to={{
                                            pathname: `/events/edit/${event.event_id}`,
                                            state: {
                                                event,
                                                from: props.location.pathname
                                            }
                                        }}>
                                            <div><FontAwesomeIcon id={event.event_id} icon={faPencilAlt} size='1x' /></div>
                                        </Link>
                                        <div><FontAwesomeIcon id={event.event_id} icon={faTrashAlt} size='1x' onClick={props.remove} /></div>
                                    </div>
                                    <EventPreview key={event.event_id} event={event} />
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default withRouter(CreatorSection);