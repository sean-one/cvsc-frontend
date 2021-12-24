import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { EventsContext } from '../../context/events/events.provider';

import './business.css';

const Business = (props) => {
    const { useBusinessById } = useContext(EventsContext)
    const [ business, setBusiness ] = useState(useBusinessById(props.match.params.id))
    const [ loading, setLoading ] = useState(false)
    
    useEffect(() => {
        if (!business) {
            setLoading(true)
            AxiosInstance.get(`/business/${props.match.params.id}`)
                .then(response => {
                        setBusiness(response.data)
                        setLoading(false)
                        // console.log(response)
                    })
                    .catch(err => {
                            setLoading(false)
                            console.log(err)
                        })
        }
        // eslint-disable-next-line
    },[])

    return (
        <div className='componentWrapper'>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <div>
                        <div className='businessHeader'>
                            <div className='branding'>
                                <img src={business.avatar} alt='business branding' />
                            </div>
                            <div className='businessName'>
                                <h2>{business.name}</h2>
                            </div>
                        </div>
                        <p>Business Page!</p>
                    </div>
                )
            }
        </div>
    )
}

export default withRouter(Business);