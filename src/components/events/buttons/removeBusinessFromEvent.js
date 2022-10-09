import React from 'react';

import { useBusinessRemoveMutation } from '../../../hooks/useEvents';

const RemoveBusinessFromEvent = ({ event_id, business_id, business_type }) => {
    const { mutateAsync: removeBusinessMutation } = useBusinessRemoveMutation()

    const removeBusinessButton = async () => {
        const update_data = {
            business_id,
            business_type
        }
        const remove_update = await removeBusinessMutation({ ...update_data, event_id })

        console.log(remove_update)
    }


    return (
        <div className='bg-light w-100 rounded' onClick={removeBusinessButton}>remove</div>
    )
}

export default RemoveBusinessFromEvent;