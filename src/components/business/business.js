import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';

import Upcoming from '../upcoming/upcoming';

import './business.css';

const Business = (props) => {
    const { useBusinessById } = useContext(SiteContext)
    const [ business, setBusiness ] = useState(useBusinessById(props.match.params.id))
    const [ loading, setLoading ] = useState(true)
    
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
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [])

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
                                <p>{`Email: ${business.email}`}</p>
                                <p>{`Instagram: ${business.instagram}`}</p>
                            </div>
                        </div>
                        <div className='businessLocation'>
                            <p>{business.formatted}</p>
                        </div>
                        <div className='businessDetails'>
                            <p>{business.description}</p>
                        </div>
                        <Upcoming business={business.id} />
                    </div>
                )
            }
        </div>
    )
}

export default withRouter(Business);