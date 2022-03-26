import { useContext } from 'react';

import { SiteContext } from '../context/site/site.provider';


const useEventsFilter = ({user_id=null, venue_id=null, brand_id=null, event_id=null}) => {
    const { events } = useContext(SiteContext)
    let filteredEvents = events

    if (user_id) {
        filteredEvents = filteredEvents.filter(e => e.created_by === user_id)
    }
    
    if (venue_id) {
        filteredEvents = filteredEvents.filter(e => e.venue_id === venue_id)
    }
    
    if (brand_id) {
        filteredEvents = filteredEvents.filter(e => e.brand_id === brand_id)
    }
    
    if (event_id) {
        filteredEvents = filteredEvents.filter(e => e.event_id !== event_id)
    }

    return filteredEvents
}

export default useEventsFilter;