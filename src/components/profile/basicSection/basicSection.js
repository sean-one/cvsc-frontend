import React, { useState } from 'react';

import CreatorRequestForm from './creatorRequestForm/creatorRequestForm';
import BusinessRequestForm from './businessRequestForm/businessRequestForm';

const BasicSection = () => {
    const [requestFormVisable, setRequestFormVisable] = useState(false)

    const toggleRequestForm = () => {
        setRequestFormVisable(!requestFormVisable)
    }

    return (
        <div className='basicSection'>
            <div className='sectionHeader'>
                <h3>Basic Options</h3>
            </div>
            <div className='sectionTabs'>
                <CreatorRequestForm viewable={requestFormVisable} toggleView={toggleRequestForm} />
                <BusinessRequestForm />
            </div>
        </div>
    )
}

export default BasicSection;