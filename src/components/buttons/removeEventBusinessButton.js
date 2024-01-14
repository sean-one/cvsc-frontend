import React from 'react';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
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
    const { data: user_roles, status: user_roles_status } = useUserRolesQuery(auth?.user?.id)
    const { mutateAsync: removeEventBusiness } = useRemoveEventBusinessMutation();
    let business_user_role = {}
    
    const isCreator = () => auth?.user?.id === eventCreator

    if (user_roles_status === 'loading') {
        return null;
    }

    if (user_roles_status === 'success') {
        business_user_role = user_roles?.data.find(role => role.business_id === businessId && role.active_role && role.role_type >= process.env.REACT_APP_MANAGER_ACCOUNT) || {}
    }


    const removeBusinessFromEvent = async (e) => {
        try {
            e.stopPropagation()

            console.log(`click - bus: ${businessId}, event: ${eventId}`)
            await removeEventBusiness({ event_id: eventId, business_id: businessId })
        } catch (error) {
            console.log(error)
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