import React, { useState } from 'react';

import { ShowIcon, HideIcon } from '../icons/siteIcons';
import Role from './role';


const CreatorRoles = ({ roles_list }) => {
    const [viewCreators, setViewCreators] = useState(true)

    const toggleCreators = () => {
        setViewCreators(!viewCreators)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionRowSplit'>
                <div className='subheaderText'>Creators</div>
                <div onClick={() => toggleCreators()}>{viewCreators ? <HideIcon /> : <ShowIcon />}</div>
            </div>
            {
                viewCreators &&
                    <div>
                        {
                            roles_list.map(role =>
                                <Role key={role.id} role={role} rolelist='creatorlist' />
                            )
                        }
                    </div>
            }
        </div>
    )
}

export default CreatorRoles;