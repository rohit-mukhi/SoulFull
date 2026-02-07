import { useState, useEffect } from 'react';
import AOS from 'aos';
import { Sling as Hamburger } from 'hamburger-react';
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import './assets/background-home.png'

function LandingPage() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="position-relative">
      <Navbar className="navbar border-bottom position-relative">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="fascinate-regular" id='logo'>SoulFull</Navbar.Brand>
          <Hamburger toggled={isOpen} toggle={setOpen} size={25} color="#FFFFFF" />
        </Container>
        
        {/* Move dropdown inside navbar for better positioning */}
        {isOpen && (
          <div 
            className="position-absolute bg-light w-100 shadow-lg"
            style={{ top: '100%', left: 0, zIndex: 1050 }}
            data-aos="fade-down"
          >
            <ul className="list-unstyled p-0 m-0 text-center">
              {['Donate Us', 'About Us', 'Login'].map((item) => (
                <li key={item} className="border-bottom py-3">
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-dark text-decoration-none d-block" onClick={() => setOpen(false)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Navbar>

      <section id="home" className="d-flex flex-column justify-content-center align-items-center text-white text-center px-3" style={{ minHeight: '100vh' }}>
        <div data-aos="fade-up" data-aos-delay="300">
          <h1 className="text display-1 fw-bolder mb-4">Hello Friend!</h1>
          <p className=" text fs-3 mb-5">Your voice deserves to be heard and your burdens deserve to be shared, so please, let it all out—I am here to listen without judgment.</p>
          <button type="button" className="get-started" onClick={handleGetStarted}>Get Started</button>
        </div>
      </section>
      
    </div>
  );
}

export default LandingPage;