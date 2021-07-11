import React, { useContext } from 'react';

import CalendarContext from '../../../context/calendarContext';

const EventCardUpcoming = (props) => {
    const { dailyEventList } = useContext(CalendarContext);
    if (props.event.brand_id === props.event.venue_id) {
        const upcomingEvents = dailyEventList.filter(event => (event.venue_id === props.event.brand_id || event.brand_id === props.event.brand_id))
        console.log(upcomingEvents)
    } else  {
        const upcomingAtLocation = dailyEventList.filter(event => (event.venue_id === props.event.venue_id && event.event_id != props.event.event_id))
        const upcomingWithBrand = dailyEventList.filter(event => (event.brand_id === props.event.brand_id && event.event_id != props.event.event_id))
        console.log(upcomingAtLocation)
        console.log(upcomingWithBrand)
    }
    return (
        <div>
            <p>{`these are upcoming events for event id: ${props.event.event_id}`}</p>
            <p>{`this is at ${props.event.venue_id}`}</p>
            <p>{`this is with ${props.event.brand_id}`}</p>
        </div>
    )
}

export default EventCardUpcoming;