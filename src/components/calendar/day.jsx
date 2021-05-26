import React from 'react'
import { format } from 'date-fns';
import { withRouter } from 'react-router-dom';

import './day.css';
import EventPreview from '../events/eventPreview';

const Day = (props) => {
    const daysEvents = props.schedule

    

    return (
        <div className={`days`}>
            <div className='dateHeader'>{format(props.date, 'MMMM d')}</div>
            {/* need to sort right here so that events list by time */}
            {daysEvents.map(event => (
                <EventPreview key={event.id} event={event}/>
            ))}
        </div>
    )
}

export default withRouter(Day);
