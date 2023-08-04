import React from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessUnknown = () => {
    let navigate = useNavigate()


    return (
        <div>
            <div>Unable to find that business</div>
            <button onClick={() => navigate('/')}>Home</button>
        </div>
    )
}

export default BusinessUnknown;