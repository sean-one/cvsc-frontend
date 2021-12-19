import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

const PendingBusiness = (props) => {

    useEffect(() => {
        AxiosInstance.get('/business/pending-approval')
            .then(businesses => {
                console.log(businesses.data[0])
            })
    }, []);

    return (
        <div>
            <div className='tabHeader'>
                <p>Pending Business Request</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
        </div>
    )
}

export default PendingBusiness;