import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
	const location = useLocation();

	return (
		<Navbar expand="lg" className="custom-navbar">
			<Container>
				<Navbar.Brand className="d-flex align-items-center">
					<span className="me-2">🎓</span>
					Student Manager
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<Link
							to="/"
							className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
						>

							Home
						</Link>
						<Link
							to="/create"
							className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
						>
							Add Student
						</Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}