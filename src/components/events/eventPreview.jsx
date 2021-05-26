// import React, { useState, useEffect } from 'react';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import './eventPreview.css';

const EventPreview = (props) => {
    const event = props.event;

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
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
            </div>
        </div>
    )
}

export default withRouter(EventPreview);