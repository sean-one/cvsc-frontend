import React, { useState, useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
// import { format } from 'date-fns';
import AxiosInstance from '../../helpers/axios';

import { EventsContext } from '../../context/events/events.provider';

import './createEvent.css';

const CreateEvent = (props) => {
    const { userEvents, addToEvents, useBrandList, useVenueList, setUserEventList } = useContext(EventsContext);
    const { register, handleSubmit, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema)
    });
    const [ adminRoleError, setAdminRoleError ] = useState(false);
    // const [ networkError, setNetworkError ] = useState(false);
    const venueList = useVenueList()
    const brandList = useBrandList()
    let history = useHistory();

    const sendEvent = async (data) => {
        // console.log(data.eventmedia[0])
        const token = localStorage.getItem('token')
        const file = data.eventmedia[0]

        if (file === undefined) {
            // this needs to create an error and stop the post.  this file is required
            const imageUrl = 'https://picsum.photos/300/400'
            data.eventmedia = imageUrl
            
        } else {
            
            //! need to validate user posting BEFORE sending the image to s3
            // get s3 url from server
            const url = await AxiosInstance.get('/s3')
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))
            
            await AxiosInstance.put(url, file, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            const imageUrl = url.split('?')[0]
            data.eventmedia = imageUrl
        }

        AxiosInstance.post('/events', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                if(response.status === 200) {
                    addToEvents(response.data)
                    setUserEventList([...userEvents], response.data)
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
                    console.log(err)
                    console.log('network error')
                } else if(err.response.status === 400) {
                    localStorage.clear()
                    history.push('/login');
                } else if(err.response.status === 403) {
                    setAdminRoleError(true);
                }
            })
    }

    return (
        <div className='componentWrapper'>
            {/* <form className='createForm' onSubmit={sendEvent}> */}
            <form className='createForm' onSubmit={handleSubmit(sendEvent)}>
                <label htmlFor='eventname'>Event Name:</label>
                <input
                    {...register('eventname')}
                    type='text'
                    id='eventname'
                    required
                />
                <p className='errormessage'>{errors.eventname?.message}</p>
                <label htmlFor='eventdate'>Event Date:</label>
                <input
                    type='date'
                    id='eventdate'
                    {...register('eventdate')}
                    required
                />
                <p className='errormessage'>{errors.eventdate?.message}</p>
                <label htmlFor='eventstart'>Start Time:</label>
                {/* <input type='time' id='eventstart' {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })} required /> */}
                <input
                    {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    type='time'
                    id='eventstart'
                    required
                />
                <p className='errormessage'>{errors.eventstart?.message}</p>
                <label htmlFor='eventend'>End Time:</label>
                <input
                    {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })}
                    type='time'
                    id='eventend'
                    required
                />
                <p className='errormessage'>{errors.eventend?.message}</p>
                <label htmlFor='eventmedia'>Image Link:</label>
                <input
                    {...register('eventmedia')}
                    type='file'
                    id='eventmedia'
                    accept='image/*'
                />
                <p className='errormessage'>{errors.eventmedia?.message}</p>
                <label htmlFor='venue_id'>Location:</label>
                <select id='venue_id' {...register('venue_id', { valueAsNumber: true })} required >
                    <option value="0">Select...</option>
                    {
                        venueList.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                            ))
                        }
                </select>
                <p className='errormessage'>{errors.venue_id?.message}</p>
                {adminRoleError && <p className='errormessage'>must have admin rights to at least one</p>}
                <label htmlFor='details'>Event Details:</label>
                <textarea
                    {...register('details')}
                    type='text'
                    id='details'
                    rows='10'
                />
                <p className='errormessage'>{errors.details?.message}</p>
                <label htmlFor='brands'>Brand(s):</label>
                <select id='brand_id' {...register('brand_id', { valueAsNumber: true })} required >
                    <option value="0">Select...</option>
                    {
                        brandList.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))
                        }
                </select>
                <p className='errormessage'>{errors.brand_id?.message}</p>
                {adminRoleError && <p className='errormessage'>must have admin rights to at least one</p>}
                {/* {networkError && <p className='errormessage networkerror'>must be online to create a new event</p>} */}
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default withRouter(CreateEvent);