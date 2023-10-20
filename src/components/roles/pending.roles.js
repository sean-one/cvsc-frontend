import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../icons/siteIcons';
import Role from './role';


const PendingRoles = ({ roles_list }) => {
    const [viewRequest, setViewRequest] = useState(true);

    const toggleRequest = () => {
        setViewRequest(!viewRequest)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionRowSplit'>
                <div className='subheaderText'>Request</div>
                <div onClick={() => toggleRequest()}>{viewRequest ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            {
                viewRequest &&
                    <div>
                        {
                            roles_list.map(role =>
                                <Role key={role.id} role={role} rolelist='pendinglist' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default PendingRoles;