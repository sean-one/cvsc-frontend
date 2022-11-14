import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import useNotification from '../../hooks/useNotification';

import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useAddEventMutation } from '../../hooks/useEvents';
import LoadingSpinner from '../loadingSpinner';

const AddEvent = () => {
    // event form object
    const [ eventname, setEventName ] = useState('')
    const [ eventdate, setEventDate ] = useState('')
    const [ eventstart, setEventStart ] = useState('')
    const [ eventend, setEventEnd ] = useState('')
    const [ eventmedia, setEventMedia ] = useState('')
    const [ venue, setVenue ] = useState('')
    const [ eventdetails, setEventDetails ] = useState('')
    const [ brand, setBrand ] = useState('')
    
    const { data: business_list, isLoading } = useBusinessesQuery()
    const { mutateAsync: addEventMutation } = useAddEventMutation()

    const { dispatch } = useNotification()

    let history = useHistory()

    if(isLoading) {
        return <LoadingSpinner />
    }

    const venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
    const brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)

    const addNewBusiness = async (e) => {
        console.log(eventstart)
        e.preventDefault()
        const formData = new FormData()
        formData.append('eventname', eventname)
        formData.append('eventdate', eventdate)
        formData.append('eventstart', parseInt(eventstart.replace(":","")))
        formData.append('eventend', parseInt(eventend.replace(":","")))
        formData.set('eventmedia', eventmedia)
        formData.append('venue_id', venue)
        formData.append('details', eventdetails)
        formData.append('brand_id', brand)

        const new_event = await addEventMutation(formData)

        if(new_event.status === 201) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `event '${new_event.data.eventname}' has been created`
                }
            })
            history.push({
                pathname: `/event/${new_event.data.event_id}`,
                state: {
                    event: new_event.data
                }
            })
        } else {
            console.log('somthing is a miss')
        }
    }

    return (
        <form onSubmit={addNewBusiness} className='w-100' encType='multipart/form-data'>
            <input
                type="text"
                name='eventname'
                placeholder='Eventname'
                required
                className='w-100 my-2'
                id='eventname'
                value={eventname}
                onChange={(e) => setEventName(e.target.value)}
            />

            <div className='d-flex justify-content-between w-100 my-2'>
                <input
                    type="date"
                    name='eventdate'
                    value={eventdate}
                    required
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <input
                    type="time"
                    name='eventstart'
                    value={eventstart}
                    onChange={(e) => setEventStart(e.target.value)}
                />
                <input
                    type="time"
                    name='eventend'
                    value={eventend}
                    onChange={(e) => setEventEnd(e.target.value)}
                />
            </div>

            <input
                type="file"
                name='eventmedia'
                className='w-100 my-2'
                onChange={(e) => setEventMedia(e.target.files[0])}
            />

            <select
                name='venue_id'
                className='w-100 my-2'
                value={venue} onChange={(e) => setVenue(e.target.value)}
            >
                <option value='0'>Dispensary / Location</option>
                {
                    venue_list.map(venue => (
                        <option key={venue.id} value={venue.id}>{venue.business_name}</option>
                    ))
                }
            </select>

            <textarea
                type='text'
                name='details'
                placeholder='Event details...'
                rows={5} className='w-100 my-2'
                value={eventdetails} onChange={(e) => setEventDetails(e.target.value)}
            />

            <select
                name='brand_id'
                className='w-100 my-2'
                value={brand} onChange={(e) => setBrand(e.target.value)}
            >
                <option value='0'>Business Brands</option>
                {
                    brand_list.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.business_name}</option>
                    ))
                }
            
            </select>

            <button type='submit'>Submit</button>

        </form>
    )
}

export default AddEvent;