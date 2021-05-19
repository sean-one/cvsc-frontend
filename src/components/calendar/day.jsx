import React from 'react'
import { format } from 'date-fns';
import { Link, withRouter } from 'react-router-dom';

import './day.css';

const Day = (props) => {
    const daysEvents = props.schedule
    
    return (
        <div className={`days`}>
            <div className='dateHeader'>{format(props.date, 'MMMM d')}</div>
            {daysEvents.map(event => (
                <div key={event.id}>
                    <Link to={{
                        pathname: `calendar/${event.id}`,
                        state: {
                            event,
                            from: props.location.pathname
                        }
                    }}>
                        <p>{event.eventName}</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default withRouter(Day);
