import React, { useState } from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa6'

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
                <div onClick={() => toggleCreators()}>{viewCreators ? <FaCaretUp className='siteIcons'  /> : <FaCaretDown className='siteIcons' />}</div>
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