import React from 'react';

import './business.css';

const EditBusiness = (props) => {
    const business = props.location.state.business
    
    console.log(business)
    return (
        <div className='componentWrapper'>
            <div>
                <div className='businessHeader'>
                    <div className='businessBranding'>
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
            </div>
        </div>
    )
}

export default EditBusiness;