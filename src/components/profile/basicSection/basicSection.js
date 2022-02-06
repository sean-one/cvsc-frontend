import React from 'react';

// Basic Section Tabs
import { withViewToggle } from '../../../hoc/withViewToggle';
import TabLink from '../sectionComponents/tabLink';
import CreatorRequestForm from './creatorRequestForm';
import UserSection from './userSection/userSection';

const BasicSection = () => {
    // wrap each section with a view toggle that expands each section
    const UserSectionWrapped = withViewToggle(UserSection)
    const CreatorRequestWrapped = withViewToggle(CreatorRequestForm)

    return (
        <div className='basicSection'>
            <div className='sectionHeader'>
                <h3>Basic Options</h3>
            </div>
            <div className='sectionTabs'>
                <UserSectionWrapped />
                <CreatorRequestWrapped />
                <TabLink title='Create Business' createtype='business'/>
            </div>
        </div>
    )
}

export default BasicSection;