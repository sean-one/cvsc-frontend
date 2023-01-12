import React from 'react';

import CalendarPreview from '../events/views/calendar.preview';

const Day = ({ schedule }) => {
    
    return (
        <>
            {schedule.sort((a,b) => a.eventstart - b.eventstart).map(event => (
                <CalendarPreview key={event.event_id} event={event}/>
            ))}
        </>
    )
}

export default Day;