import React from 'react';
import { FaTrashCan } from 'react-icons/fa6';

import { useRoleDelete } from '../../../hooks/useRolesApi';


const DeleteRole = ({ role }) => {
    const { mutateAsync: deleteRole } = useRoleDelete();

    const sendRoleDelete = async (role_id) => {
        await deleteRole(role_id)
    }

    return (
        <div className='deleteButton' onClick={() => sendRoleDelete(role.id)}>
            <FaTrashCan className='siteIcons' style={{ color: 'var(--error-color)' }} />
        </div>
    )
}

export default DeleteRole;