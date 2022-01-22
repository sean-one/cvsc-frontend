import React from 'react';
import { format } from 'date-fns';
import { withRouter } from 'react-router-dom';

import './day.css';
import EventPreview from '../events/eventPreview';

const Day = (props) => {
    const daysEvents = props.schedule
    
    return (
        <div className={`days`}>
            <div className='dateHeader'>{format(props.date, 'MMMM d')}</div>

            {daysEvents.sort((a,b) => a.eventstart - b.eventstart).map(event => (
                <EventPreview key={event.event_id} event={event}/>
            ))}
        </div>
    )
}

export default withRouter(Day);