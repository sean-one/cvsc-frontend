import React from 'react';

import { useRoleDelete } from '../../../hooks/useRolesApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteRole = ({ role }) => {
    const { mutateAsync: deleteRole } = useRoleDelete();

    const sendRoleDelete = async (role_id) => {
        await deleteRole(role_id)
    }

    return (
        <div className='deleteButton' onClick={() => sendRoleDelete(role.id)}>
            <DeleteIcon />
        </div>
    )
}

export default DeleteRole;