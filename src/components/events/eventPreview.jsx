// import React, { useState, useEffect } from 'react';
import React from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './eventPreview.css';
// import UserContext from '../../context/userContext';

const EventPreview = (props) => {
    // const { userProfile } = useContext(UserContext);
    const event = props.event;
    let history = useHistory();

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }
    // console.log(userProfile)
    const removeEvent = (e) => {
        // e.preventDefault()
        try {
            AxiosInstance.delete(`/events/remove/${event.event_id}`)
                .then(response => {
                    if(response.status === 204) {
                        history.push('/profile')
                    }
                })
        } catch (error) {
            
        }
        console.log(event.event_id)
    }

    const user = JSON.parse(localStorage.getItem('user'))
    let adminControls = null;
    if (user && user.id === event.created_by) {
        adminControls = <div className='eventAdmin'>
                            <div className='adminIcon'>
                                <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                            </div>
                            <div id={event.event_id} className='adminIcon' onClick={removeEvent} >
                                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                            </div>
                        </div>
    }

    return (
        <div className='eventCard' key={event.event_id}>
            <div className='cardImg'>
                <Link to={{
                    pathname: `/calendar/${event.event_id}`,
                    state: {
                        event,
                        from: props.location.pathname
                    }
                }}>
                    <img src={event.eventmedia} alt={`upcoming event - ${event.eventname}`} />
                </Link>
            </div>
            <div className='cardInfo'>
                <div className='cardTitle'>
                    <Link to={{
                        pathname: `/calendar/${event.event_id}`,
                        state: {
                            event,
                            from: props.location.pathname
                        }
                    }}>
                        <p>{event.eventname}</p>
                    </Link>
                </div>
                <div className='cardLocation'>
                    <p>{`${event.venue_name}`}</p>
                </div>
                <div className='cardDetails'>
                    <Link to={{
                        pathname: `/calendar/${event.event_id}`,
                        state: {
                            event,
                            from: props.location.pathname
                        }
                    }}>
                        <p>{detailPreview(event.details, 100)}</p>
                    </Link>
                </div>
                <div className='brand'>
                    <p>{event.brand_name}</p>
                </div>
                {adminControls}
            </div>
        </div>
    )
}

export default withRouter(EventPreview);