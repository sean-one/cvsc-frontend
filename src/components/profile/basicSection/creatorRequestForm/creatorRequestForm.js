import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestBusinessCreator } from '../../../../helpers/validationSchemas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

import { SiteContext } from '../../../../context/site/site.provider';

import useBusinessList from '../../../../hooks/useBusinessList';

import '../basicSection.css'

const CreatorRequestForm = (props) => {
    const { businessList } = useContext(SiteContext)
    const { businessCreatorRequest } = useBusinessList(businessList)
    
    const [ requestStatus, setRequestStatus ] = useState('')
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });

    const sendRequest = (data) => {
        const token = localStorage.getItem('token')

        AxiosInstance.post('/pendingRequest', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                setRequestStatus('request successfully sent')
                setTimeout(() => {
                    reset()
                    setRequestStatus('')
                }, 1000)
                
            })
            .catch(err => {
                if(err.response.data.type === 'duplicate') {
                    setRequestStatus('a previous request for this business is still pending')
                }
            })
    }

    const resetStatus = () => {
        setRequestStatus('')
    }

    return (
        <div className='requestCreator'>
            <div className='tabHeader'>
                <p>Request Business Creator Rights</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
            <div className={props.viewable ? 'requestFormWrapper' : 'inactive'}>
                <form className='creatorRequestForm' onSubmit={handleSubmit(sendRequest)}>
                    <label htmlFor='business_id'>business</label>
                    <select id='business_id' {...register('business_id', { valueAsNumber: true })} required onFocus={resetStatus} >
                        <option value='0'>Select...</option>
                        {
                            businessCreatorRequest.map(business => (
                                <option key={business.id} value={business.id}>{business.name}</option>
                            ))
                        }
                    </select>
                    <p className='errormessage'>{errors.business_id?.message}</p>
                    <div className='radioBox'>

                        <input {...register('request_for', { required: true })} type="radio" id="creator_rights" value="creator" />
                        <label htmlFor='creator_rights' >creator</label>
                        
                        <input {...register('request_for', { required: true })} type="radio" id="admin_rights" value="admin" />
                        <label htmlFor='admin_rights' >admin</label>
                        
                    </div>
                    <input type='submit' value='submit' />
                </form>
                <p>{requestStatus}</p>
            </div>
        </div>
    )
}

export default CreatorRequestForm;