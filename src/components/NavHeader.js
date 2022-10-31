import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

import { UsersContext } from '../context/users/users.provider';

import logobrand from '../assets/cvsc.png'
import AxiosInstance from '../helpers/axios';


export const NavHeader = () => {
    const { userSignOut } = useContext(UsersContext)
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    let history = useHistory()

    const logout = async () => {
        await AxiosInstance.get('/auth/logout')
        
        localStorage.clear()
        
        userSignOut()
        
        history.push('/')
        
        // document.getElementById('navbarToggle').classList.remove('show')
        // document.getElementById('navbarToggle').classList.add('hide')
        
    }

    
    const goto = (link) => {
        document.getElementById('navbarToggle').classList.remove('show')
        document.getElementById('navbarToggle').classList.add('hide')
        
        if(!link) {
            history.push('/')
        } else {
            history.push(`/${link}`)
        }
    }

    console.log(isLoggedIn)

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
                            (!isLoggedIn)
                                ? <Nav.Item>
                                    <Nav.Link onClick={() => goto('register')}>Register</Nav.Link>
                                </Nav.Item>
                                : <Nav.Item>
                                    <Nav.Link onClick={() => goto('profile')}>Profile</Nav.Link>
                                </Nav.Item>
                        }
                        {
                            (isLoggedIn)
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