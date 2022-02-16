import React from 'react';

// Basic Section Tabs
import { withViewToggle } from '../../../hoc/withViewToggle';
import TabLink from '../sectionComponents/tabLink';
import CreatorRequest from './creatorRequest';
import UserSection from './userSection';

const BasicSection = () => {
    // wrap each section with a view toggle that expands each section
    const UserProfileTab = withViewToggle(UserSection)
    const CreatorRequestTab = withViewToggle(CreatorRequest)

    return (
        <div className='basicSection'>
            <div className='sectionHeader'>
                <h3>Basic Options</h3>
            </div>
            <div className='sectionTabs'>
                <UserProfileTab />
                <CreatorRequestTab />
                <TabLink title='Create Business' createtype='business'/>
            </div>
        </div>
    )
}

export default BasicSection;