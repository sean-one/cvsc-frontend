import React from 'react'
import styled from 'styled-components'
import { FaXTwitter, FaFacebookF, FaTelegram, FaWhatsapp } from 'react-icons/fa6'
// import { FaXTwitter, FaInstagram, FaFacebookF, FaTelegram, FaWhatsapp } from 'react-icons/fa6'

const ShareBarStyles = styled.div`
    .shareBarWrapper {
        padding-top: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0.5rem;   
    }
    
    #shareButtons {
        width: 100%;
        line-height: 0.75;
        padding: 1rem 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .shareTitle {
        width: 100%;
        text-align: center;
        font-size: 0.9rem;
        letter-spacing: 0.2rem;
    }

    .shareButton {
        /* font-size: var(--site-icon-size); */
        font-size: 2.5rem;
    }
`;

const ShareBar = (props) => {
    const { shareUrl, title } = props
    // console.log(shareUrl)

    return(
        <ShareBarStyles>
            <div className='shareBarWrapper'>
                <div className="shareTitle" >Share this event!</div>
                <div id='shareButtons'>
                    <a href={`https://twitter.com/intent/tweet?text=Check out: ${title}&url=${encodeURI(shareUrl)}`} target='_blank' rel="noreferrer"><FaXTwitter className="shareButton" /></a>
                    <a href={`https://facebook.com/sharer/sharer.php?u=${encodeURI(shareUrl)}`} target='_blank' rel="noreferrer"><FaFacebookF className="shareButton" /></a>
                    {/* <div><FaInstagram className="shareButton" /></div> */}
                    <a href={`https://t.me/share/url?url=${encodeURI(shareUrl)}&text=${title}`} target='_blank' rel="noreferrer"><FaTelegram className="shareButton" /></a>
                    <a href={`https://api.whatsapp.com/send?text=${title} ${shareUrl}`} target='_blank' rel="noreferrer"><FaWhatsapp className="shareButton" /></a>
                </div>
            </div>
        </ShareBarStyles>
    )
}

export default ShareBar;