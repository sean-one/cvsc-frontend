import React from 'react';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { RemoveBusinessIcon } from '../icons/siteIcons';
// import { useRemoveEventBusinessMutation } from '../../hooks/useEventsApi';
import { useUserBusinessRole } from '../../hooks/useRolesApi';

const RemoveEventBusinessButtonStyles = styled.div`
    .removeBusinessIconWrapper {
        /* border: 1px solid red; */
    }
`

const RemoveEventBusinessButton = ({ eventId, businessId, eventCreator }) => {
    const { auth } = useAuth();
    // const { mutateAsync: removeEventBusiness } = useRemoveEventBusinessMutation();
    const { data: user_business_role, status: role_status } = useUserBusinessRole(businessId);
    const isCreator = () => auth?.user?.id === eventCreator

    if (role_status === 'loading') {
        return null;
    }

    // if (role_status === 'error') {
    //     return null;
    // }

    const removeBusinessFromEvent = async (e) => {
        try {
            e.stopPropagation()

            console.log(`click - bus: ${businessId}, event: ${eventId}`)
            // await removeEventBusiness({ event_id: eventId, business_id: businessId })
        } catch (error) {
            console.log(error)
        }
    }

    const userRoleType = parseInt(user_business_role?.data?.role_type, 10);
    const managerAccountThreshold = parseInt(process.env.REACT_APP_MANAGER_ACCOUNT, 10);


    return (
        <RemoveEventBusinessButtonStyles>
            {
                ((userRoleType >= managerAccountThreshold) || isCreator())
                    ? <div className='removeBusinessIconWrapper' onClick={(e) => removeBusinessFromEvent(e)}>
                        <RemoveBusinessIcon />
                    </div>
                    : null
            }
        </RemoveEventBusinessButtonStyles>
    )
}

export default RemoveEventBusinessButton;