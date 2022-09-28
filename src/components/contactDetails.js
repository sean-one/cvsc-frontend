import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';

const ContactDetails = ({ contact_detail, contact_type }) => {
    const contact_icons = {
        'facebook': faFacebook,
        'instagram': faInstagram,
        'twitter': faTwitter,
        'website': faGlobe,
        'email': faEnvelope,
        'phone': faPhone
    }
    return (
        <div className='px-0 d-flex justify-content-start align-items-center'>
            <div className='p-0 m-0'>
                <FontAwesomeIcon icon={contact_icons[contact_type]} />
            </div>
            <div className='ps-2'>
                {contact_detail}
            </div>
        </div>
    )
}

export default ContactDetails;