import React from 'react';

import { role_types } from '../../helpers/dataCleanUp';
import RemoveRole from './buttons/remove.role';


const InactiveRoles = ({ roles_list }) => {
    return (
        <div>
            <h6>INACTIVE</h6>
            {
                roles_list.map(role =>
                    <div key={role.id}>
                        <div>{role.username}</div>
                        <div>{role_types[role.role_type].type}</div>
                        <div>inactive</div>
                        <div>
                            <RemoveRole role_id={role.id} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default InactiveRoles;