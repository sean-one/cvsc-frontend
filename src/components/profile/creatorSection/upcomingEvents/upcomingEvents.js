import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

import EventPreview from '../../../events/eventPreview';

import { UsersContext } from '../../../../context/users/users.provider';

import '../creatorSection.css';

const UpcomingEvents = (props) => {
    const { userEvents } = useContext(UsersContext)
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

export default withRouter(UpcomingEvents);