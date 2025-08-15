import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Login from './Login';
import Logout from './Logout';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar expand="lg" className="navbar-navy mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Code Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="codeblog-navbar" />
        <Navbar.Collapse id="codeblog-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/posts">Posts</Nav.Link>
            <Nav.Link as={NavLink} to="/favorites">Favorites</Nav.Link>
            <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="navbar-text">Hi, {user.name}</span>
                <Logout />
              </>
            ) : (
              <Login />
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
