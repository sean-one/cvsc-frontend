import React from 'react';

import { withViewToggle } from '../../../hoc/withViewToggle';
import PendingRequest from './pendingRequest';

import './businessAdminSection.css';


const BusinessAdminSection = (props) => {
    const PendingRequestTab = withViewToggle(PendingRequest)

    return (
        <div className='businessAdminSection'>
            <div className='sectionHeader'>
                <h3>Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                <PendingRequestTab />
            </div>
        </div>
    )

}

export default BusinessAdminSection;