import React, { useContext } from 'react';

import EventPreview from './eventPreview';
import { SiteContext } from '../../context/site/site.provider';

const UpcomingEvents = (props) => {
    const { useEventFilterVenueId, useEventFilterBrandId } = useContext(SiteContext)
    const venueEvents = useEventFilterVenueId(props.venue)
    const brandEvents = useEventFilterBrandId(props.brand)

    console.log(venueEvents)
    console.log(brandEvents)

    return (
        <React.Fragment>
            {
                (venueEvents.length > 0) &&
                    <React.Fragment>
                        {
                            venueEvents.map(e => {
                                return (
                                    <EventPreview key={e.event_id} event={e} />
                                )
                            })
                        }
                    </React.Fragment>
            }
            {
                (brandEvents.length > 0) &&
                    <React.Fragment>
                        {
                            brandEvents.map(e => {
                                return (
                                    <EventPreview key={e.event_id} event={e} />
                                )
                            })
                        }
                    </React.Fragment>
            }
        </React.Fragment>
    )
}

export default UpcomingEvents;