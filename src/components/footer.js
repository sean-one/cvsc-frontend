import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const FooterStyles = styled.div`
    .footerWrapper {
        width: 100%;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--opacity);
        gap: 1rem;
    }

    .footerSection {
        text-align: center;
        width: 100%;
        font-size: var(--small-font);
    }
`;


const Footer = () => {
    let navigate = useNavigate()

    return (
        <FooterStyles>
            <div className='footerWrapper'>
                <div className='footerSection'>
                    <div onClick={() => navigate('/cvsc-privacypolicy')}>Privacy Policy</div>
                </div>

                <div className='footerSection'>
                    2024
                </div>

                <div className='footerSection'>
                    <div onClick={() => navigate('/cvsc-tos')}>Terms Of Service</div>
                </div>
            </div>
        </FooterStyles>
    )
}

export default Footer;