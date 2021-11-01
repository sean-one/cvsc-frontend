import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import UpcomingEvents from './upcomingEvents/upcomingEvents';

import './creatorSection.css';
import '../profile.css';

const CreatorSection = (props) => {
    const [ eventListVisable, setEventListVisable ] = useState(false);

    const toggleEventList = () => {
        setEventListVisable(!eventListVisable)
    }

    return (
        <div className='creatorSection'>
            <div className='sectionHeader'>
                <h3>Creator Options</h3>
            </div>
            <div className='sectionTabs'>
                <div className='tabHeader'>
                    <p>Create A New Event</p>
                    <span><Link to={{
                        pathname: '/events/create',
                        state: {
                            from: props.location.pathname
                        }
                    }}>
                        <FontAwesomeIcon className='tabIcon' icon={faPlus} size='1x' />
                    </Link></span>
                </div>
                <UpcomingEvents viewable={eventListVisable} toggleView={toggleEventList}/>
            </div>
        </div>
    )
}

export default withRouter(CreatorSection);