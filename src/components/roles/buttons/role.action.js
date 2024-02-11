import React from 'react';

import { useRoleAction } from '../../../hooks/useRolesApi';
import { ApproveUserIcon } from '../../icons/siteIcons';

const RoleAction = ({ role_id, actionType }) => {
    const { mutate: roleAction } = useRoleAction();

    const handleRoleAction = () => {
        roleAction({ role_id, action_type: actionType });
    };

    const renderButtonContent = () => {
        if (actionType === 'approve') {
            return <ApproveUserIcon />;
        }

        if (actionType === 'inactive') {
            return null;
        }

        // just returning upgrade or downgrade until icons are found
        return actionType.charAt(0).toUpperCase() + actionType.slice(1);
    };

    return (
        <div onClick={handleRoleAction}>
            {renderButtonContent()}
        </div>
    );
};

export default RoleAction;
