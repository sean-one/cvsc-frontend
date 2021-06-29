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
            </div>
        </div>
    )
}

export default withRouter(EventPreview);