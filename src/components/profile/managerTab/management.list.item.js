import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';


const ManagementListItem = ({ business }) => {
    let navigate = useNavigate()

    
    return (
        <div>
            <div className='d-flex border-top border-dark my-2 rounded' onClick={() => navigate(`/business/${business.id}`)}>
                <div className='pe-2'>
                    {business.business_type}
                </div>
                <div className='flex-grow-1 fw-bold'>
                    {business.business_name}
                </div>
                <div className='px-2'>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
        </div>
    )
}

export default ManagementListItem;