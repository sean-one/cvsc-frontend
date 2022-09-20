import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

import EditLocationButton from '../../editButtonModals/editLocationButton';
import LoadingSpinner from '../../loadingSpinner';
import { useBusinessLocationQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';


const BusinessLocation = ({ business }) => {
    const { data: business_location, isLoading } = useBusinessLocationQuery(business.id)
    const { userProfile } = useContext(UsersContext);

    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <Row className='px-3 py-1'>
            {
                (userProfile.id === business.business_admin)
                    ? <EditLocationButton business_id={business.id} />
                    : (
                        <Col xs={1} className='px-0'>
                            <FontAwesomeIcon icon={faMapMarkedAlt} />
                        </Col>
                    )
            }
            <Col xs={11} className='px-0'>
                {`${business_location.data.street_address}, ${business_location.data.location_city}`}
            </Col>
        </Row>
    )
}

export default BusinessLocation;