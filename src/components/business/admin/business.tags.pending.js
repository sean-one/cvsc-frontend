import React from 'react';
import styled from 'styled-components';

import { useBusinessTagsbyBusinessQuery } from '../../../hooks/useBusinessTagsApi';
import LoadingSpinner from '../../loadingSpinner';

const BusinessTagsPendingStyles = styled.div``;


const BusinessTagsPending = ({ business_id }) => {
    const { data: business_tags, isPending, isError, error: business_tags_error } = useBusinessTagsbyBusinessQuery(business_id)

    if (isError) {
        console.log(business_tags_error)
    }

    if (isPending) {
        return <LoadingSpinner />
    }

    const business_tags_pending = business_tags?.data || []

    console.log(business_tags_pending)

    return (
        <BusinessTagsPendingStyles>
            {
                business_tags_pending.length < 1
                    ? <div>no pending</div>
                    : <div>Pending Business Tags!</div>
            }
        </BusinessTagsPendingStyles>
    )
}

export default BusinessTagsPending;