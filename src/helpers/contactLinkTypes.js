import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGlobe, faPhone } from "@fortawesome/free-solid-svg-icons";

export const ContactLinkType = {
    'facebook': {
        icon: faFacebook,
        link: 'https://www.facebook.com/sean.ackerman.7564',
        color: '#4267B2'
    },
    'instagram': {
        icon: faInstagram,
        link: 'https://www.instagram.com/senor_one_more',
        color: '#833AB4'
    },
    'twitter': {
        icon: faTwitter,
        link: 'https://twitter.com/senor_one_more',
        color: '#1DA1F2'
    },
    'website': {
        icon: faGlobe,
        link: 'https://seanone.online',
        color: '#D4DF9C'
    },
    'email': {
        icon: faEnvelope,
        link: 'mailto:ackerman.sean.w@gmail.com',
        color: '#D0E0E3'
    },
    'phone': {
        icon: faPhone,
        link: 'tel:7605673179',
        color: '#198754'
    },
}