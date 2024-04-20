import React from 'react';
import { FaUserCheck, FaUserTie, FaUserMinus } from 'react-icons/fa6';

import { useRoleAction } from '../../../hooks/useRolesApi';


const RoleAction = ({ role_id, actionType }) => {
    const { mutate: roleAction } = useRoleAction();

    const handleRoleAction = () => {
        roleAction({ role_id, action_type: actionType });
    };

    const renderButtonContent = () => {
        if (actionType === 'approve') {
            return <FaUserCheck className='siteIcons' />;
        }

        if (actionType === 'upgrade') {
            return <FaUserTie className='siteIcons' />;
        }

        if (actionType === 'downgrade') {
            return <FaUserMinus className='siteIcons' />;
        }

        if (actionType === 'inactive') {
            return null;
        }
    };

    return (
        <div onClick={handleRoleAction}>
            {renderButtonContent()}
        </div>
    );
};

export default RoleAction;
