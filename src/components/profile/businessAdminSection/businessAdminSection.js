import React from 'react';

const BusinessAdminSection = (props) => {
    return (
        <div className='businessAdminSection'>
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

export default BusinessAdminSection;