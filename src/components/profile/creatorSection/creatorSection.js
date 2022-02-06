import React from 'react';

import { withViewToggle } from '../../../hoc/withViewToggle';
import TabLink from '../sectionComponents/tabLink';
import UpcomingEvents from './upcomingEvents/upcomingEvents';

import './creatorSection.css';
import '../profile.css';

const CreatorSection = (props) => {
    const UpcomingSectionWrapped = withViewToggle(UpcomingEvents)

    return (
        <div className='creatorSection'>
            <div className='sectionHeader'>
                <h3>Creator Options</h3>
            </div>
            <div className='sectionTabs'>
                <TabLink title='Create Event' createtype='event' />
                <UpcomingSectionWrapped />
            </div>
        </div>
    )
}

export default CreatorSection;