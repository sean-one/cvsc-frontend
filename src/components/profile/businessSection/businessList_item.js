import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import BusinessContols from '../../business/businessControls';

const BusinessListItem = ({ business, location }) => {

    return (
        <div>
            <div className='d-flex border-bottom border-dark my-1 rounded'>
                <Col xs={2} className='pe-2'>
                    {business.business_type}
                </Col>
                <Col xs={8} className='flex-grow-1'>
                    <Link to={{
                        pathname: `/business/manage/${business.id}`,
                        state: {
                            business_id: business.id,
                            from: location.pathname
                        }
                    }}>{business.business_name}</Link>
                </Col>
                <Col xs={1} className='px-2'>
                    <FontAwesomeIcon icon={faChevronRight} />
                </Col>
            </div>
            <BusinessContols business_id={business.id}/>
        </div>
    )
}

export default withRouter(BusinessListItem)