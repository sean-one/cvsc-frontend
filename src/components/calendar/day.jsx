import React from 'react';
// import { format } from 'date-fns';
import { withRouter } from 'react-router-dom';

import EventPreview from '../events/eventPreview';

const Day = (props) => {
    const daysEvents = props.schedule
    
    return (
        <>
            {/* <u><h4>{format(props.date, 'MMMM d')}</h4></u> */}
            {daysEvents.sort((a,b) => a.eventstart - b.eventstart).map(event => (
                <EventPreview key={event.event_id} event={event}/>
            ))}
        </>
    )
}

export default withRouter(Day);