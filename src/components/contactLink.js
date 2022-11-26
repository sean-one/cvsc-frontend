import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContactLinkType } from '../helpers/contactLinkTypes';

const ContactLink = ({ contact_type }) => {


    return (
        <div className='p-0 m-0' style={{ color: `${ContactLinkType[contact_type].color}`}}>
            <a href={ContactLinkType[contact_type].link} target='_blank'>
                <FontAwesomeIcon icon={ContactLinkType[contact_type].icon} />
            </a>
        </div>
    )
}

export default ContactLink;