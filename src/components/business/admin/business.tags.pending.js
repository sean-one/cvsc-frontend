import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useBusinessTagsbyBusinessQuery } from '../../../hooks/useBusinessTagsApi';
import { image_link } from '../../../helpers/dataCleanUp';
import LoadingSpinner from '../../loadingSpinner';

import { ApproveIcon, DeleteIcon, SmallUserIcon } from '../../icons/siteIcons';

const BusinessTagsPendingStyles = styled.div`
    .businessTagsPendingWrapper {
        margin: 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        border-top: 1px dotted var(--secondary-color);
        border-bottom: 1px dotted var(--secondary-color);
    }

    .businessTagsPendingEventImage {
        width: 6.5rem;
        height: 6.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            border: 1px solid var(--trim-color);
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .businessTagsPendingEventDetails {
        padding-left: 1rem;
        flex-grow: 1;
    }

    .businessTagsPendingActions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .approveBusinessTag, .rejectBusinessTag {
        cursor: pointer;
    }
`;


const BusinessTagsPending = ({ business_id }) => {
    const { data: business_tags, isPending, isError, error: business_tags_error } = useBusinessTagsbyBusinessQuery(business_id)

    let navigate = useNavigate();

    if (isError) {
        console.log(business_tags_error)
    }

    if (isPending) {
        return <LoadingSpinner />
    }

    const business_tags_pending = business_tags?.data || []

    const approveBusinessTag = (business_id) => {
        console.log(`approve: ${business_id}`)
    }

    const rejectBusinessTag = (business_id) => {
        console.log(`reject: ${business_id}`)
    }

    return (
        <BusinessTagsPendingStyles>
            {
                business_tags_pending.length > 0
                    ? <div className='sectionContainer'>
                        <div className='subheaderText'>Pending Business Tags</div>
                        {
                            business_tags_pending.map(business_tag => (
                                <div key={business_tag?.id} className='businessTagsPendingWrapper'>
                                    <div className='businessTagsPendingEventImage' onClick={() => navigate(`/event/${business_tag?.event_id}`)}>
                                        <img src={image_link(business_tag?.eventmedia)} alt={business_tag?.eventname} />
                                    </div>
                                    <div className='businessTagsPendingEventDetails' onClick={() => navigate(`/event/${business_tag?.event_id}`)}>
                                        <div className='smallHeaderText'>{business_tag?.eventname}</div>
                                        <div className='smallText'>{business_tag?.formatted_address}</div>
                                        <div><SmallUserIcon />{business_tag?.username}</div>
                                    </div>
                                    <div className='businessTagsPendingActions'>
                                        <div className='approveBusinessTag' onClick={() => approveBusinessTag(business_tag?.id)}>
                                            <ApproveIcon />
                                        </div>
                                        <div className='rejectBusinessTag' onClick={() => rejectBusinessTag(business_tag?.id)}>
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    : null
            }
        </BusinessTagsPendingStyles>
    )
}

export default BusinessTagsPending;