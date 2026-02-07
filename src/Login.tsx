import { useState, useEffect } from 'react';
import AOS from 'aos';
import { Sling as Hamburger } from 'hamburger-react';
import { Container, Navbar, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import './Login.css'

function Login() {
  const [isOpen, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.status === 404) {
        setError('User does not exist');
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      if (data?.session?.access_token) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/chat');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="position-relative">
      <Navbar className="navbar border-bottom position-relative">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="fascinate-regular" id='logo'>SoulFull</Navbar.Brand>
          <Hamburger toggled={isOpen} toggle={setOpen} size={25} color="#FFFFFF" />
        </Container>
        
        {isOpen && (
          <div 
            className="position-absolute bg-light w-100 shadow-lg"
            style={{ top: '100%', left: 0, zIndex: 1050 }}
            data-aos="fade-down"
          >
            <ul className="list-unstyled p-0 m-0 text-center">
              {['Home', 'Donate Us', 'About Us'].map((item) => (
                <li key={item} className="border-bottom py-3">
                  <a href={item === 'Home' ? '/' : `#${item.toLowerCase()}`} className="text-dark text-decoration-none d-block" onClick={() => setOpen(false)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Navbar>

      <section id="login" className="d-flex flex-column justify-content-center align-items-center px-3" style={{ minHeight: '100vh' }}>
        <div data-aos="fade-up" data-aos-delay="300" className="w-100" style={{ maxWidth: '400px' }}>
          <h1 className="text display-4 fw-bolder mb-4 text-center" style={{ color: '#452829' }}>Welcome Back</h1>
          <p className="text fs-5 mb-4 text-center" style={{ color: '#452829' }}>Sign in to continue your journey</p>
          
          <Form className="p-4 rounded shadow" style={{ background: 'rgba(255, 255, 255, 0.9)' }} onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ border: '2px solid #452829' }}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: '2px solid #452829' }}
                required
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              className="w-100 get-started"
              style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Sign In
            </Button>
            
            <div className="text-center mt-3">
              <a href="#forgot" style={{ color: '#452829', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
            
            <div className="text-center mt-2">
              <span style={{ color: '#452829' }}>Don't have an account? </span>
              <button 
                type="button"
                onClick={() => navigate('/signup')} 
                style={{ 
                  color: '#452829', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default Login;