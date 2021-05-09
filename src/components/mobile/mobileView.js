import React from 'react';
import { format } from 'date-fns';

import fakeEvents from '../../fakeData/fakeEvents';

const MobileView = () => {
    const eventData = fakeEvents
    const eventsByDate = eventData.sort((a,b) => a.eventStart > b.eventStart ? 1 : -1)
     

    console.log(eventData);
    return (
        <div>
            {eventsByDate.map(( event, i ) => (
                <p key={i}>{event.eventName} / {format(event.eventStart, 'MMMM d Y')}</p>
            ))}
        </div>
    );
}

export default MobileView;
