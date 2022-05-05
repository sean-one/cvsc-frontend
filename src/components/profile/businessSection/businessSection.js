import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';
import ManagementSection from './managementSection/managementSection';
import AdminSection from './adminSection/adminSection';


const BusinessSection = () => {
    const { userProfile } = useContext(UsersContext)
    
    return (
        <Row className='my-3'>
            <h3>{`Business ${userProfile.account_type} Options`}</h3>
            {
                (userProfile.account_type === 'manager') ?
                    <ManagementSection />
                    : null
            }
            {
                (userProfile.account_type === 'admin') ?
                    <AdminSection />
                    : null
            }
        </Row>
    )
}

export default BusinessSection;