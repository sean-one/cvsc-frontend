import React, { useState } from 'react';

import Role from './role';


const PendingRoles = ({ roles_list }) => {
    const [viewRequest, setViewRequest] = useState(true);

    const toggleRequest = () => {
        setViewRequest(!viewRequest)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionHeader sectionListHeader'>
                <div>Request</div>
                <div onClick={() => toggleRequest()}>{viewRequest ? 'hide' : 'view'}</div>
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