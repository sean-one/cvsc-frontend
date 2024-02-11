import React from 'react';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { RemoveBusinessIcon } from '../icons/siteIcons';
import { useRemoveEventBusinessMutation } from '../../hooks/useEventsApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';

const RemoveEventBusinessButtonStyles = styled.div`
    .removeBusinessIconWrapper {
        /* border: 1px solid red; */
    }
`

const RemoveEventBusinessButton = ({ eventId, businessId, eventCreator }) => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    // if any errors are hit do nothing and show nothing
    const { data: user_roles, isPending, isSuccess } = useUserRolesQuery(auth?.user?.id)
    const { mutate: removeEventBusiness } = useRemoveEventBusinessMutation();
    let business_user_role = {}
    
    const isCreator = () => auth?.user?.id === eventCreator

    if (isPending) {
        return null;
    }

    if (isSuccess) {
        business_user_role = user_roles?.data.find(role => role.business_id === businessId && role.active_role && (role.role_type === 'manager' || role.role_type === 'admin')) || {}
    }

    const removeBusinessFromEvent = async (e) => {
        try {
            e.stopPropagation()
            await removeEventBusiness({ event_id: eventId, business_id: businessId })
        } catch (error) {
            // 401, 403 'token', 400 'business_id', 'event_id' & 'server'
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: error?.response?.data?.error?.message
                }
            })
        }
    }


    return (
        <RemoveEventBusinessButtonStyles>
            {
                ((Object.keys(business_user_role).length > 0) || isCreator())
                    ? <div className='removeBusinessIconWrapper' onClick={(e) => removeBusinessFromEvent(e)}>
                        <RemoveBusinessIcon />
                    </div>
                    : null
            }
        </RemoveEventBusinessButtonStyles>
    )
}

export default RemoveEventBusinessButton;