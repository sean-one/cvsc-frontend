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
    // if any errors are hit do nothing and show nothing
    const { data: user_roles, isPending, isSuccess } = useUserRolesQuery(auth?.user?.id)
    const { mutateAsync: removeEventBusiness } = useRemoveEventBusinessMutation();
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
            // e.stopPropagation()

            console.log(`click - bus: ${businessId}, event: ${eventId}`)
            await removeEventBusiness({ event_id: eventId, business_id: businessId })
        } catch (error) {
            console.log('error inside remove business button')
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