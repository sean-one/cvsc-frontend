import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaBars, FaX } from 'react-icons/fa6';
import styled from 'styled-components';

import CVSCLogoWhite from '../assets/smokers_club.webp';
import CVSCLogoBlack from '../assets/smokers_club-black.webp';
import Menu from './menu'
import useTheme from '../hooks/useTheme';

const NavbarStyles = styled.div`
    .navWrapper {
        position: fixed;
        padding: 0 1.5rem;
        top: 0;
        left: 0;
        height: var(--header-height);
        background-color: var(--main-background-color);
        box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.3);
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        z-index: 90;
    }

    .navContainer {
        padding: 0.5rem 0;
        min-height: 100%;
        width: 100%;
        max-width: var(--max-page-width);
        display: flex;
        justify-content: space-between;
    }

    .navBarBranding {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navBarLogo {
        width: 10rem;
        max-height: 100%;
        fill: var(--text-color);
    }

    .navBarMenu {
        color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .navBarIcons {
        font-size: var(--navbar-icon-size);
    }

    .toggler {
        display: flex;
        justify-content: center;
        width: 4.5rem;
        padding: 0.75rem;
    }
`;

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)
    const { themeName } = useTheme()
    
    let navigate = useNavigate()

    
    return (
        <NavbarStyles>
            <div className='navWrapper'>
                <div className='navContainer'>
                    <div className='navBarBranding' onClick={() => navigate('/')}>
                        {
                            themeName === 'dark'
                                ? <img className='navBarLogo' src={CVSCLogoWhite} alt='smokers club branding' />
                                : <img className='navBarLogo' src={CVSCLogoBlack} alt='smokers club branding' />
                        }
                    </div>
                    <div className='navBarMenu'>
                        <div className='toggler' onClick={() => setToggle(!toggle)}>
                            {
                                toggle
                                    ? <FaX className='navBarIcons' style={{ color: 'var(--error-color)' }} />
                                    : <FaBars className='navBarIcons' />
                            }
                        </div>
                    </div>
                </div>
                {
                    toggle && <Menu toggle={setToggle} />
                }
            </div>
        </NavbarStyles>
  )
}

export default Navbar