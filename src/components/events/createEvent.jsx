import React, { useState, useRef, useEffect, useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';

import './createEvent.css';

const CreateEvent = (props) => {
    
    const { createEvent, useBrandList, useVenueList } = useContext(SiteContext)
    const { register, handleSubmit, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema)
    });
    
    const canvas = useRef(null)
    const [ adminRoleError, setAdminRoleError ] = useState(false);
    const [ eventImage, setEventImage ] = useState()
    const [ addImage, setAddImage ] = useState(false)
    // const [ networkError, setNetworkError ] = useState(false);
    const venueList = useVenueList()
    const brandList = useBrandList()
    let history = useHistory();
    

    const previewImage = (event) => {
        setAddImage(true)
        let fileToUpload = event.target.files
        let reader = new FileReader()
        const previewImage = new Image()
        reader.onload = function(e) {
            previewImage.src = e.target.result
            previewImage.onload = () => setEventImage(previewImage)
        }
        reader.readAsDataURL(fileToUpload[0])

    }

    const sendEvent = async (data) => {
        canvas.current.toBlob(async function(blob) {
            const token = localStorage.getItem('token')

            // get image url from s3 bucket
            const url = await AxiosInstance.get('/s3', { headers: { 'Authorization': 'Bearer ' + token } })
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))
            
            // upload the image to the s3 bucket at the url recieved
            await AxiosInstance.put(url, blob, { headers: { 'Content-Type': 'multipart/form-data' }})

            const imageUrl = url.split('?')[0]
            
            data.eventmedia = imageUrl
            
            AxiosInstance.post('/events', data, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(response => {
                    if(response.status === 200) {
                        createEvent(response.data)
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
        })
        
    }

    useEffect(() => {
        if(eventImage && canvas) {
            const ctx = canvas.current.getContext('2d')
            const MAX_WIDTH = 384
            const MAX_HEIGHT = 480
            let width = eventImage.width
            let height = eventImage.height

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
            }
            else if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
            } else {
                if (width > height) {
                    width = MAX_WIDTH;
                    height *= width / MAX_WIDTH;
                } else {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH
                }
            }
            
            // crops canvas to the size of the drawing
            canvas.current.width = width
            canvas.current.height = height

            ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

            ctx.drawImage(eventImage, ( canvas.current.width / 2 ) - ( width / 2 ), ( canvas.current.height / 2 ) - ( height / 2 ), width, height)
        }
    }, [eventImage, canvas]);

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
                {
                    addImage && 
                        <canvas
                            id={'eventImagePreview'}
                            ref={canvas}
                            width={384}
                            height={480}
                        />
                }
                <label htmlFor='eventmedia'>Image Link:</label>
                <input
                    {...register('eventmedia')}
                    type='file'
                    id='eventmedia'
                    accept='image/*'
                    onChange={previewImage}
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