import React, { useState } from 'react';

import CreatorRequestForm from './creatorRequestForm/creatorRequestForm';
import BusinessRequestForm from './businessRequestForm/businessRequestForm';
import UserSection from './userSection/userSection';

const BasicSection = () => {
    const [userProfileVisable, setUserProfileVisable] = useState(false)
    const [requestFormVisable, setRequestFormVisable] = useState(false)
    const [businessRequestFormVisable, setBusinessRequestFormVisable] = useState(false)

    const toggleUserProfile = () => {
        setUserProfileVisable(!userProfileVisable)
    }

    const toggleRequestForm = () => {
        setRequestFormVisable(!requestFormVisable)
    }

    const toggleBusinessRequestForm = () => {
        setBusinessRequestFormVisable(!businessRequestFormVisable)
    }

    return (
        <div className='basicSection'>
            <div className='sectionHeader'>
                <h3>Basic Options</h3>
            </div>
            <div className='sectionTabs'>
                <UserSection viewable={userProfileVisable} toggleView={toggleUserProfile} />
                <CreatorRequestForm viewable={requestFormVisable} toggleView={toggleRequestForm} />
                <BusinessRequestForm viewable={businessRequestFormVisable} toggleView={toggleBusinessRequestForm} />
            </div>
        </div>
    )
}

export default BasicSection;