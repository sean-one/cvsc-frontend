import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import useNotification from '../../../hooks/useNotification';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import squirrel_master from '../../../assets/squirrel-master.webp';
import LoadingSpinner from '../../loadingSpinner';
import BusinessesViewCard from '../../business/businesses.view.card';

const ModBusinessesStyles = styled.div`
    .modBusinessesWrapper {
        padding: 2rem 1rem;
        margin: 0 auto;
        max-width: var(--max-section-width);
        /* background: var(--opacity); */
    }
    
    .modBusinessesHeader {
        display: flex;
        align-items: center;
        justify-content: space-around;

        div {
            text-align: center;
            flex-grow: 1;
        }

        img {
            cursor: pointer;
            max-width: 5rem;
        }
    }
`;

const ModBusinesses = () => {
    const { dispatch } = useNotification()
    const { data: businesses_list, isPending, isError, error: businesses_list_error } = useBusinessesQuery()
    
    let navigate = useNavigate();

    if (isError) {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: businesses_list_error?.response?.data?.error?.message
            }
        })
    }


    return (
        <ModBusinessesStyles>
            <div className='modBusinessesWrapper'>
                <div className='modBusinessesHeader'>
                    <div className='subheaderText'>Businesses Mod Section</div>
                    <img onClick={() => navigate('/squirrelmaster')} src={squirrel_master} alt='squirrel' />
                </div>
                {
                    isPending ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        null
                    ) : (
                        <div>
                            {
                                businesses_list?.data?.map(business => {
                                    return (
                                        <BusinessesViewCard key={business.id} business={business} />
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </ModBusinessesStyles>
    )
}

export default ModBusinesses;