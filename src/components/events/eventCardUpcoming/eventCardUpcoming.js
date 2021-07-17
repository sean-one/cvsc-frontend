import React, { useContext } from 'react';

import EventPreview from '../eventPreview';

import CalendarContext from '../../../context/calendarContext';

const EventCardUpcoming = (props) => {
    const { dailyEventList } = useContext(CalendarContext);
    let upcomingEvents = []
    if (props.event.brand_id === props.event.venue_id) {
        upcomingEvents = dailyEventList.filter(event => ((event.venue_id === props.event.brand_id || event.brand_id === props.event.brand_id) && event.event_id !== props.event.event_id))
        // console.log(upcomingEvents)
    } else  {
        const upcomingAtLocation = dailyEventList.filter(event => (event.venue_id === props.event.venue_id && event.event_id !== props.event.event_id))
        const upcomingWithBrand = dailyEventList.filter(event => (event.brand_id === props.event.brand_id && event.event_id !== props.event.event_id))
        // console.log(upcomingAtLocation)
        // console.log(upcomingWithBrand)
    }
    return (
        <div>
            {
                (upcomingEvents) && 
                    upcomingEvents.map(event => {
                        return (
                            <EventPreview key={event.event_id} event={event}/>
                        )
                    })
            }
        </div>
    )
}

export default EventCardUpcoming;