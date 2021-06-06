// import React, { useState, useEffect } from 'react';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './eventPreview.css';

const EventPreview = (props) => {
    const event = props.event;

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }

    const user = JSON.parse(localStorage.getItem('user'))
    let adminControls = null;
    if (user && user.id === event.created_by) {
        adminControls = <div className='eventAdmin'>
                            <span className='adminIcon'>
                                <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                            </span>
                            <span className='adminIcon'>
                                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                            </span>
                        </div>
    }

    return (
        <div className='eventCard' key={event.id}>
            <div className='cardImg'>
                <Link to={{
                    pathname: `/calendar/${event.id}`,
                    state: {
                        event,
                        from: props.location.pathname
                    }
                }}>
                    <img src={event.media} alt={`upcoming event - ${event.eventname}`} />
                </Link>
            </div>
            <div className='cardInfo'>
                <div className='cardTitle'>
                    <Link to={{
                        pathname: `/calendar/${event.id}`,
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
                        pathname: `/calendar/${event.id}`,
                        state: {
                            event,
                            from: props.location.pathname
                        }
                    }}>
                        <p>{detailPreview(event.details, 100)}</p>
                    </Link>
                </div>
                <div className='brand'>
                    <p>{event.name}</p>
                </div>
                {adminControls}
            </div>
        </div>
    )
}

export default withRouter(EventPreview);