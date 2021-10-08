import React, { useContext, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import AxiosInstance from '../../../../helpers/axios';

import EventPreview from '../../../events/eventPreview';

import { EventsContext } from '../../../../context/events/events.provider';

import '../creatorSection.css';

const UpcomingEvents = (props) => {
    const { userEvents, setUserEventList, removeEvent } = useContext(EventsContext)

    const deleteEvent = (eventId) => {
        const token = localStorage.getItem('token')
        AxiosInstance.delete(`/events/remove/${eventId}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                removeEvent(eventId)
            })
            .catch(err => {
                console.log('something went wront', err)
            })
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        AxiosInstance.get(`events/user/${parseInt(localStorage.getItem('userId'))}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(user_events => {
                setUserEventList(user_events.data)
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div>
            <div className='upcomingEvents'>
                <p>Upcoming Events</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
            {
                (props.viewable) &&
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
                                        <div><FontAwesomeIcon id={event.event_id} icon={faTrashAlt} size='1x' onClick={() => deleteEvent(event.event_id)} /></div>
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

export default withRouter(UpcomingEvents);