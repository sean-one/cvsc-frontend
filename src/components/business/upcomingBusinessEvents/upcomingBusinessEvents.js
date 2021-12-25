import React, { useState, useEffect } from 'react'
import AxiosInstance from '../../../helpers/axios'
import EventPreview from '../../events/eventPreview'

const UpcomingBusinessEvents = (props) => {
    const [ loading, setLoading ] = useState(true)
    const [ upcomingEvents, setUpcomingEvents ] = useState()

    useEffect(() => {
        AxiosInstance.get(`/events/business/${props.business}`)
            .then(events => {
                setUpcomingEvents(events.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    console.log(upcomingEvents)

    return (
        <div className='componentWrapper'>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <div>
                        {
                            (upcomingEvents && upcomingEvents.length > 0) &&
                                <div>
                                    {
                                        upcomingEvents.map(event => {
                                            return (
                                                <EventPreview key={event.event_id} event={event} />
                                            )
                                        })
                                    }
                                </div>    
                        }
                    </div>
                )
            }
        </div>
    )
}

export default UpcomingBusinessEvents;