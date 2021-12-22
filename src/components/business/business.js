import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import './business.css';

const Business = (props) => {
    const [ business, setBusiness ] = useState()
    const [ loading, setLoading ] = useState(false)

    const getBusiness = () => {
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

    useEffect(() => {
        getBusiness()
        // return () => {
        //     setLoading(false)
        // }
        // eslint-disable-next-line
    },[props.match.params.id])
    console.log(props)
    console.log(business)
    return (
        <div className='componentWrapper'>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <div>
                        {/* <div className='businessHeader'>
                            <div className='branding'>
                                <img src={business.avatar} alt='business branding' />
                            </div>
                            <div className='businessName'>
                                <h2>{business.name}</h2>
                            </div>
                        </div> */}
                        <p>Business Page!</p>
                    </div>
                )
            }
        </div>
    )
}

export default withRouter(Business);