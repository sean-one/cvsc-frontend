import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

import useAuth from '../hooks/useAuth';

import logobrand from '../assets/cvsc.png'
import AxiosInstance from '../helpers/axios';


export const NavHeader = () => {
    const { auth, setAuth } = useAuth()
    let navigate = useNavigate()

    const logout = async () => {
        const response = await AxiosInstance.get('/auth/logout')

        if(response.status === 204) {
            console.log('got response of 204')
            localStorage.clear()
            
            setAuth({})

        }
        
        document.getElementById('navbarToggle').classList.remove('show')
        document.getElementById('navbarToggle').classList.add('hide')
        
        navigate('/')
    }

    
    const goto = (link) => {
        document.getElementById('navbarToggle').classList.remove('show')
        document.getElementById('navbarToggle').classList.add('hide')
        
        if(!link) {
            navigate('/')
        } else {
            navigate(`/${link}`)
        }
    }


    return (
        <Navbar expand='sm' bg="light" variant="light" fixed='top' className='py-0'>
            <Container>
                <Navbar.Brand>
                    <Link to={{ pathname: "/" }}>
                        <img
                            src={logobrand}
                            width="85"
                            height="auto"
                            className="d-inline-block align-center"
                            alt="Coachella Valley Smokers Club logo"
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarToggle" />
                <Navbar.Collapse id='navbarToggle'>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Item>
                            <Nav.Link onClick={() => goto()}>Calendar</Nav.Link>
                        </Nav.Item>
                        {
                            (Object.keys(auth).length < 1)
                                ? <Nav.Item>
                                    <Nav.Link onClick={() => goto('register')}>Register</Nav.Link>
                                </Nav.Item>
                                : <Nav.Item>
                                    <Nav.Link onClick={() => goto('profile')}>Profile</Nav.Link>
                                </Nav.Item>
                        }
                        {
                            (Object.keys(auth).length > 1)
                                ? <Nav.Item>
                                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                                </Nav.Item>
                                : <Nav.Item>
                                    <Nav.Link onClick={() => goto('login')}>Login</Nav.Link>
                                </Nav.Item>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}