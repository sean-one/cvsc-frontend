import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../../../icons/siteIcons';
import BusinessRole from '../../../roles/business.role';


const CreatorRoles = ({ roles_list }) => {
    const [viewCreators, setViewCreators] = useState(false)

    const toggleCreators = () => {
        setViewCreators(!viewCreators)
    }


    return (
        <div className='rolesListSection'>
            <div className='rolesListSectionHeader'>
                <div className='subheaderText'>Creators</div>
                <div onClick={() => toggleCreators()}>{viewCreators ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            {
                viewCreators &&
                    <div>
                        {
                            roles_list.map(role =>
                                <BusinessRole key={role.id} role={role} list_type='creator' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default CreatorRoles;