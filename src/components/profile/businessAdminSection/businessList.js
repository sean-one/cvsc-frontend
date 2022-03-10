import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis } from '@fortawesome/free-solid-svg-icons';

import { SiteContext } from '../../../context/site/site.provider';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = (props) => {
    const { useBusinessAdmin } = useContext(SiteContext)
    const { userProfile } = useContext(UsersContext)
    
    const business_admin_ids = useBusinessAdmin(userProfile.id)

    return (
        <div className='businessListTab'>
            {
                (props.viewable) &&
                <div className='businessList'>
                    {
                        business_admin_ids.map(business => (
                            <Link className='businessListRow' key={business.id} to={{
                                pathname:`/business/edit/${business.id}`,
                                state: {
                                    business,
                                    from: props.location.pathname
                                }
                            }}>
                                <FontAwesomeIcon className='tabIcon' icon={faCannabis} size='1x' /><p className='businessListing'>{business.name}</p>
                            </Link>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default withRouter(BusinessList);