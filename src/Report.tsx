import { useState, useEffect } from 'react';
import AOS from 'aos';
import { Sling as Hamburger } from 'hamburger-react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

function Report() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const report = location.state?.report || 'No report available';
  const metrics = location.state?.metrics || { stress: 0, depression: 0, anxiety: 0 };
  const suggestions = location.state?.suggestions || 'No suggestions available';

  const getSeverityColor = (level: number) => {
    if (level <= 3) return '#8BAE66';
    if (level <= 6) return '#EBD5AB';
    return '#D9534F';
  };

  const getSeverityLabel = (level: number) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  useEffect(() => {
    AOS.init({ once: true });
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

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
              {['Home', 'Chat', 'Logout'].map((item) => (
                <li key={item} className="border-bottom py-3">
                  <a 
                    href={item === 'Home' ? '/' : item === 'Chat' ? '/chat' : '#'} 
                    className="text-dark text-decoration-none d-block" 
                    onClick={(e) => {
                      if (item === 'Logout') {
                        e.preventDefault();
                        localStorage.clear();
                        navigate('/');
                      } else if (item === 'Chat') {
                        e.preventDefault();
                        navigate('/chat');
                      }
                      setOpen(false);
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Navbar>

      <section id="report" className="d-flex flex-column justify-content-center align-items-center px-3" style={{ minHeight: '100vh' }}>
        <div data-aos="fade-up" data-aos-delay="300" className="w-100" style={{ maxWidth: '700px' }}>
          <h1 className="text display-4 fw-bolder mb-4 text-center" style={{ color: '#452829' }}>Your Emotional Report</h1>
          
          <div className="p-4 rounded shadow mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <h5 className="mb-3" style={{ color: '#452829', fontWeight: 'bold' }}>Analysis</h5>
            <p className="fs-5 mb-0" style={{ color: '#452829', lineHeight: '1.8' }}>
              {report}
            </p>
          </div>

          <div className="p-4 rounded shadow mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <h5 className="mb-3" style={{ color: '#452829', fontWeight: 'bold' }}>Mental Health Metrics</h5>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: '#452829', fontWeight: '600' }}>Stress Level</span>
                <span style={{ color: getSeverityColor(metrics.stress), fontWeight: 'bold' }}>
                  {metrics.stress}/10 - {getSeverityLabel(metrics.stress)}
                </span>
              </div>
              <div style={{ background: '#EBD5AB', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${metrics.stress * 10}%`, 
                  height: '100%', 
                  background: getSeverityColor(metrics.stress),
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: '#452829', fontWeight: '600' }}>Depression Severity</span>
                <span style={{ color: getSeverityColor(metrics.depression), fontWeight: 'bold' }}>
                  {metrics.depression}/10 - {getSeverityLabel(metrics.depression)}
                </span>
              </div>
              <div style={{ background: '#EBD5AB', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${metrics.depression * 10}%`, 
                  height: '100%', 
                  background: getSeverityColor(metrics.depression),
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div className="mb-0">
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: '#452829', fontWeight: '600' }}>Anxiety Level</span>
                <span style={{ color: getSeverityColor(metrics.anxiety), fontWeight: 'bold' }}>
                  {metrics.anxiety}/10 - {getSeverityLabel(metrics.anxiety)}
                </span>
              </div>
              <div style={{ background: '#EBD5AB', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${metrics.anxiety * 10}%`, 
                  height: '100%', 
                  background: getSeverityColor(metrics.anxiety),
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded shadow mb-3" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <h5 className="mb-3" style={{ color: '#452829', fontWeight: 'bold' }}>Ways to Improve</h5>
            <p className="fs-6 mb-0" style={{ color: '#452829', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {suggestions}
            </p>
          </div>
          
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              onClick={() => navigate('/chat')}
              className="get-started"
              style={{ fontSize: '1rem', fontWeight: 'bold', padding: '10px 30px' }}
            >
              Back to Chat
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Report;
