import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import BusinessContols from '../../business/businessControls';

const BusinessListItem = ({ business }) => {
    const [ controlShow, setControlShow ] = useState(false)

    return (
        <div>
            <div className='d-flex border-bottom border-dark my-1 rounded'>
                <Col xs={2} className='pe-2'>
                    {business.business_type}
                </Col>
                <Col xs={8} className='flex-grow-1'>
                    {business.business_name}
                </Col>
                <Col xs={1} className='px-2' onClick={() => setControlShow(!controlShow)}>
                    {
                        (controlShow)
                            ? <FontAwesomeIcon icon={faChevronDown} />
                            : <FontAwesomeIcon icon={faChevronRight} />
                    }
                </Col>
            </div>
            {
                (controlShow) &&
                    <BusinessContols business={business}/>
            }
        </div>
    )
}

export default BusinessListItem;