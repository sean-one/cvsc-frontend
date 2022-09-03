import React from 'react';
import { withRouter } from 'react-router-dom';

import EventMainPreview from '../events/cardViews/eventMainPreview';

const Day = (props) => {
    const daysEvents = props.schedule
    
    return (
        <>
            {daysEvents.sort((a,b) => a.eventstart - b.eventstart).map(event => (
                <EventMainPreview key={event.event_id} event={event}/>
            ))}
        </>
    )
}

export default withRouter(Day);