import React, { useState } from 'react';

import Role from './role';


const CreatorRoles = ({ roles_list }) => {
    const [viewCreators, setViewCreators] = useState(true)

    const toggleCreators = () => {
        setViewCreators(!viewCreators)
    }


    return (
        <div className='sectionContainer'>
            <div className='sectionHeader sectionListHeader'>
                <div>Creators</div>
                <div onClick={() => toggleCreators()}>{viewCreators ? 'hide' : 'view'}</div>
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