import { useContext } from 'react';
import { Img } from '@chakra-ui/react';
import { ButtonGroup, Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import Profile from "./Authentication/Profile"
import { AuthContext } from './Authentication/AuthProvider';
import { Link } from 'react-router-dom';
import RupeeIcon from '../assets/rupee.png';

function CollapsibleExample() {
    const { user } = useContext(AuthContext);

    return (
        <Navbar sticky='top' collapseOnSelect expand="lg" style={{ background: 'rgb(36 36 36)', minHeight: '10vh' }} variant="dark">
            <Container>
                <Navbar.Brand as={Link} to='/'><Img src={RupeeIcon} height={'5'} width={'5'} display='inline-flex' /> FinTrack</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <Link className='nav-router' to={'/'}>Home</Link>
                                <Link className='nav-router' to={'/user'}>User</Link>
                                <Link className='nav-router' to={'/transaction'}>Transaction</Link>
                            </>
                        )}
                    </Nav>
                    {user && (
                        <Nav>
                            <Dropdown as={ButtonGroup} align={{ lg: 'end' }}>
                                {/* <Avatar size='sm' bg="blue.500" /> */}
                                {/* <Dropdown.Toggle as={NavLink} split variant="success" id="dropdown-split-basic" /> */}
                                <Profile />
                            </Dropdown>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CollapsibleExample;