import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import AxiosInstance from '../../helpers/axios';

import './createEvent.css';

const CreateEvent = (props) => {
    const { register, handleSubmit } = useForm();
    // console.log(props.location.pathname)
    const [ venueList, setVenueList ] = useState([])
    const [ brandList, setBrandList ] = useState([])
    // creates variable to for date input constraint
    const earliestEventDate = format(new Date(), 'yyyy-MM-dd');
    let history = useHistory();

    const getBusinessInfo = async () => {
        const brands = await AxiosInstance.get('/business/brands');
        setBrandList(brands.data)
        const venues = await AxiosInstance.get('/business/venues');
        setVenueList(venues.data)
    }

    useEffect(() => {
        getBusinessInfo()
    }, []);

    const sendEvent = (event) => {
        AxiosInstance.post('/events', event)
            .then(response => {
                if(response.status === 200) {
                    console.log(response)
                    history.push({
                        pathname: `/calendar/${response.data.event_id}`,
                        state: {
                            event: response.data
                        }
                    });
                } else {
                    console.log(response)
                    // throw new Error();
                }
            })
            .catch(err => {
                if(!err.response) {
                    console.log('network error')
                } else if(err.response.status === 400) {
                    localStorage.clear()
                    history.push('/login');
                }
            })
    }

    return (
        <div className='formWrapper'>
            {/* <form className='createForm' onSubmit={sendEvent}> */}
            <form className='createForm' onSubmit={handleSubmit((eventdata) => sendEvent(eventdata))}>
                <label htmlFor='eventname'>Event Name:</label>
                <input type='text' id='eventname' {...register('eventname')} required />
                <label htmlFor='eventdate'>Event Date:</label>
                <input type='date' id='eventdate' {...register('eventdate')} min={earliestEventDate} required />
                <label htmlFor='eventstart'>Start Time:</label>
                {/* <input type='time' id='eventstart' {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })} required /> */}
                <input type='time' id='eventstart' {...register('eventstart')} required />
                <label htmlFor='eventend'>End Time:</label>
                <input type='time' id='eventend' {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })} required />
                <label htmlFor='eventmedia'>Image Link:</label>
                <input type='url' id='eventmedia' {...register('eventmedia')} />
                <label htmlFor='location'>Location:</label>
                <select id='location_id' {...register('location_id', { valueAsNumber: true })} required >
                    <option value="">Select...</option>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))
                    }
                </select>
                <label htmlFor='details'>Event Details:</label>
                <textarea type='text' id='details' {...register('details')} rows='10' />
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brand_id' {...register('brand_id', { valueAsNumber: true })} required >
                    <option value="">Select...</option>
                    {
                        brandList.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))
                    }
                </select>
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default withRouter(CreateEvent);