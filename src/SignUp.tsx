import { useState, useEffect } from 'react';
import AOS from 'aos';
import { Sling as Hamburger } from 'hamburger-react';
import { Container, Navbar, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import './assets/background-home.png';

function SignUp() {
  const [isOpen, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain at least one digit';
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordError(validatePassword(pwd));
  };

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordError) {
      setError('Please fix password requirements');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
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

      <section id="signup" className="d-flex flex-column justify-content-center align-items-center px-3" style={{ minHeight: '100vh' }}>
        <div data-aos="fade-up" data-aos-delay="300" className="w-100" style={{ maxWidth: '400px' }}>
          <h1 className="text display-4 fw-bolder mb-4 text-center" style={{ color: '#452829' }}>Join Us</h1>
          <p className="text fs-5 mb-4 text-center" style={{ color: '#452829' }}>Create your account to get started</p>
          
          <Form className="p-4 rounded shadow" style={{ background: 'rgba(255, 255, 255, 0.9)' }} onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ border: '2px solid #452829' }}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: '2px solid #452829' }}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ border: '2px solid #452829' }}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#452829', fontWeight: 'bold' }}>Password</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{ border: '2px solid #452829', paddingRight: '40px' }}
                />
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute"
                  style={{ right: '5px', top: '50%', transform: 'translateY(-50%)', color: '#452829', textDecoration: 'none' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </Button>
              </div>
              {passwordError && password.length > 0 && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {passwordError}
                </div>
              )}
              <Form.Text style={{ color: '#666', fontSize: '0.85rem' }}>
                Must be 8+ characters with one uppercase letter and one digit
              </Form.Text>
            </Form.Group>
            
            <Button 
              type="submit" 
              className="w-100 get-started"
              style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Sign Up
            </Button>
            
            <div className="text-center mt-3">
              <span style={{ color: '#452829' }}>Already have an account? </span>
              <button 
                type="button"
                onClick={() => navigate('/login')} 
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
                Sign In
              </button>
            </div>
          </Form>
        </div>
      </section>
    </div>
  );
}

export default SignUp;