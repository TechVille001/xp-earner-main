import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import axios from 'axios';
import { isLogged } from '../../services/auth';

const AppHeader = () => {
    const isUser = isLogged();

    const navigate = useNavigate();

    const handleLogout = () => {
        axios
            .get('https://xp-earner.onrender.com/api/v1/logout', {
                withCredentials: true,
                credentials: 'include',
            })
            .then((res) => {
                console.log(res);
                navigate('/');
                alert('Logged out successfully');
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data.message);
            });
    };
    return (
        <Navbar collapseOnSelect expand="lg" bg="#0f172a" variant="slate">
            <Navbar.Brand
                onClick={() => {
                    navigate('/');
                }}
            >
                <img src="../public/logo.png" className="mr-2 sm:h-9" alt="Ekehi" />
            </Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Nav>
                    {!isUser && (
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                    )}
                    {!isUser && (
                        <Link to="/register" className="nav-link">
                            Sign Up
                        </Link>
                    )}
                    {isUser && (
                        <Link to="/profile" className="nav-link">
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{ marginRight: '5px' }}
                            />
                            Profile
                        </Link>
                    )}
                    {isUser && (
                        <Link to="/">
                            <Button onClick={handleLogout} variant="danger">
                                Logout
                            </Button>
                        </Link>
                    )}
                </Nav>
            </Navbar.Collapse> */}
        </Navbar>
    );
};

export default AppHeader;
