import React from 'react';

import useNotification from '../../../hooks/useNotification';
import { useRoleAction } from '../../../hooks/useRolesApi';
import { role_types } from '../../../helpers/dataCleanUp';
import { ApproveUserIcon } from '../../icons/siteIcons';

const RoleAction = ({ role_id, actionType }) => {
    const { dispatch } = useNotification();
    const { mutateAsync: roleAction } = useRoleAction();

    const handleRoleAction = async () => {
        try {
            const response = await roleAction({ role_id, action_type: actionType });

            if (response.status === 200) {
                let message;
                switch (actionType) {
                    case 'downgrade':
                        message = `${response.data.username} has been downgraded to creator privileges`;
                        break;
                    case 'upgrade':
                        message = `${response.data.username} now has ${role_types[response.data.role_type].type} privileges`;
                        break;
                    case 'approve':
                        message = `${response.data.username} now has ${role_types[response.data.role_type].type} privileges`;
                        break;
                    default:
                        throw new Error('Invalid actionType');
                }

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: message,
                    },
                });
            }
        } catch (error) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message,
                },
            });
        }
    };

    const renderButtonContent = () => {
        if (actionType === 'approve') {
            return <ApproveUserIcon />;
        }

        return actionType.charAt(0).toUpperCase() + actionType.slice(1);
    };

    return (
        <div onClick={handleRoleAction}>
            {renderButtonContent()}
        </div>
    );
};

export default RoleAction;
