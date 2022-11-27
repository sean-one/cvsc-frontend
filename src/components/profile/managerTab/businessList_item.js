import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';


const BusinessListItem = ({ business }) => {
    let navigate = useNavigate()

    const business_view = () => {
        navigate(`/business/${business.id}`)
    }

    return (
        <div>
            <div className='d-flex border-top border-dark my-2 rounded' onClick={() => business_view()}>
                <Col xs={2} className='pe-2'>
                    {business.business_type}
                </Col>
                <Col xs={8} className='flex-grow-1 fw-bold'>
                    {business.business_name}
                </Col>
                <Col xs={1} className='px-2'>
                    <FontAwesomeIcon icon={faChevronRight} />
                </Col>
            </div>
        </div>
    )
}

export default BusinessListItem;