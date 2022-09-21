import React from 'react';

import EventCalendarPreview from '../events/cardViews/eventCalendarPreview';

const Day = ({ schedule }) => {
    
    return (
        <>
            {schedule.sort((a,b) => a.eventstart - b.eventstart).map(event => (
                <EventCalendarPreview key={event.event_id} event={event}/>
            ))}
        </>
    )
}

export default Day;