import React from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';

import './eventPreview.css';

const EventPreview = (props) => {
    const event = props.event;
    let history = useHistory();

    const detailPreview = (eventdetails, cutoff) => {
        return (eventdetails.length > cutoff) ? eventdetails.substr(0, cutoff - 1) + '...' : eventdetails;
    }

    const user = JSON.parse(localStorage.getItem('user'))

    return (
        <>
            <Link to={{
                pathname: `/calendar/${event.event_id}`,
                state: {
                    event,
                    from: props.location.pathname
                }
            }}>
                <div className='eventCard' key={event.event_id}>
                    <div className='cardImg'>
                        <img src={event.eventmedia} alt={`upcoming event - ${event.eventname}`} />
                    </div>
                    <div className='cardInfo'>
                        <div className='cardTitle'>
                            <p>{event.eventname}</p>
                        </div>
                        <div className='cardLocation'>
                            <p>{`${event.venue_name}`}</p>
                        </div>
                        <div className='cardDetails'>
                            <p>{detailPreview(event.details, 100)}</p>
                        </div>
                        <div className='brand'>
                            <p>{event.brand_name}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default withRouter(EventPreview);