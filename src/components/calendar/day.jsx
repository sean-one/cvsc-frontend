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
            {/*
                need to sort right here so that events list by time
                -- sort by start time
                -- if start time is the same
                    --- check end time
                    --- sort by end time
                    --- if end time is the same
                        --- sort by created_at
            */}
            {daysEvents.map(event => (
                <EventPreview key={event.event_id} event={event}/>
            ))}
        </div>
    )
}

export default withRouter(Day);