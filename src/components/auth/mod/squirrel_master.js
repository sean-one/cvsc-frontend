import React from 'react';
import { useNavigate } from 'react-router-dom';

const SquirrelMaster = () => {
    let navigate = useNavigate()

    return (
        <div>
            <h1>Squirrel Master!</h1>
            <div className='buttonLike' onClick={() => navigate('/squirrelmaster/users')}>USERS</div>
            <div className='buttonLike' onClick={() => navigate('/squirrelmaster/businesses')}>BUSINESSES</div>
            <div className='buttonLike' onClick={() => navigate('/squirrelmaster/events')}>EVENTS</div>
            <div className='buttonLike' onClick={() => navigate('/squirrelmaster/logs')}>LOGS</div>
        </div>
    )
}

export default SquirrelMaster;