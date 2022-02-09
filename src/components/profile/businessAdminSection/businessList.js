import React from 'react';

const BusinessList = (props) => {
    return (
        <div className='businessListTab'>
            <div className='sectionHeader'>
                <h3>Business Admin Options</h3>
            </div>
            <div className='sectionTabs'>
                {
                    props.businessAdminList.map(business => (
                        <p key={business.id}>{business.name}</p>
                    ))
                }

            </div>
        </div>
    )
}

export default BusinessList;