import React, { useContext } from 'react';

import EventPreview from '../events/eventPreview'

import { SiteContext } from '../../context/site/site.provider';


const Upcoming = (props) => {
    const { businessList, events } = useContext(SiteContext)
    const passedBusiness = businessList.find(b => b.id === props.business)

    const upcomingBusiness = events.filter(event => event.brand_id === passedBusiness.id || event.venue_id === passedBusiness.id )

    return (
        <div>
            {
                (upcomingBusiness && upcomingBusiness.length > 0) &&
                <div>
                    {
                        upcomingBusiness.map(e => {
                            return (
                                <EventPreview key={e.event_id} event={e} />
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default Upcoming;