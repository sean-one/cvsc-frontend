import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { UsersContext } from '../../../context/users/users.provider';


const BusinessSection = () => {
    const { setAccountType } = useContext(UsersContext)
    const account_type = setAccountType()

    let history = useHistory()
    
    const businessListLink = () => {
        history.push('/admin/business_list')
    }

    return (
        <div className='border border-info'>
            <div className='bg-light d-flex justify-content-between align-items-center rounded p-2 my-1' onClick={() => businessListLink()}>
                <p className='lh-sm m-0'>{`${account_type.charAt(0).toUpperCase() + account_type.slice(1)} Options`}</p>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        </div>
    )
}

export default BusinessSection;