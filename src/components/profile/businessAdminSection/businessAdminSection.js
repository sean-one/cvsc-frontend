import React from 'react';

import { withViewToggle } from '../../../hoc/withViewToggle';
import PendingRequest from './pendingRequest';
import BusinessList from './businessList';

import './businessAdminSection.css';


const BusinessAdminSection = (props) => {
    const PendingRequestTab = withViewToggle(PendingRequest)
    const BusinessListTab = withViewToggle(BusinessList)

    return (
        <div className='businessAdminSection'>
            <div className='sectionHeader'>
                <h3>Business Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                <PendingRequestTab />
                <BusinessListTab />
            </div>
        </div>
    )

}

export default BusinessAdminSection;