import { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import { Sling as Hamburger } from 'hamburger-react';
import { Container, Navbar, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import './assets/background-home.png';

interface Message {
  id: number;
  text: string;
  sender: string;
  isLoading?: boolean;
}

function Chat() {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true });
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user?.user_metadata?.username || 'there';
    setMessages([{ id: 1, text: `Hello ${username}! I'm here to listen. How are you feeling today?`, sender: 'bot' }]);
  }, [navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage = { id: Date.now(), text: message, sender: 'user' };
      const loadingMessage = { id: Date.now() + 1, text: '', sender: 'bot', isLoading: true };
      
      setMessages(prev => [...prev, userMessage, loadingMessage]);
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = '38px';
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            messages: [{ content: message }]
          })
        });
        
        const data = await response.json();
        
        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: data?.content || 'No response', isLoading: false }
            : msg
        ));
      } catch (error) {
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: "Sorry, I'm having trouble connecting. Please try again.", isLoading: false }
            : msg
        ));
      }
    }
  };

  const handleGetReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chatHistory: messages })
      });
      
      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }
      
      navigate('/report', { state: { report: data.report, metrics: data.metrics, suggestions: data.suggestions } });
    } catch (error) {
      console.error('Error getting report:', error);
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
              {['Home', 'Donate Us', 'About Us', 'Logout'].map((item) => (
                <li key={item} className="border-bottom py-3">
                  <a 
                    href={item === 'Home' ? '/' : item === 'Logout' ? '#' : `#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-dark text-decoration-none d-block" 
                    onClick={(e) => {
                      if (item === 'Logout') {
                        e.preventDefault();
                        localStorage.clear();
                        navigate('/');
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

      <section id="chat" className="d-flex flex-column px-3" style={{ minHeight: '100vh' }}>
        <div className="flex-grow-1 d-flex flex-column" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div 
            ref={chatContainerRef}
            className="flex-grow-1 mt-5 p-3 mb-3 rounded shadow"
            style={{ 
              background: 'rgba(255, 255, 255, 0.3)', 
              overflowY: 'auto',
              minHeight: '400px',
              maxHeight: '500px'
            }}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className="p-3 rounded"
                  style={{
                    maxWidth: '70%',
                    background: msg.sender === 'user' ? '#8BAE66' : '#EBD5AB',
                    color: '#452829',
                    border: '2px solid #452829'
                  }}
                >
                  {msg.isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status" style={{ width: '1rem', height: '1rem', color: '#452829' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Form onSubmit={handleSendMessage} className="p-3 rounded shadow" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
            <div className="d-flex gap-2 align-items-end">
              <Form.Control
                ref={textareaRef}
                as="textarea"
                rows={1}
                placeholder="Type Something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                style={{ 
                  border: '2px solid #452829', 
                  flex: 1,
                  resize: 'none',
                  minHeight: '38px',
                  maxHeight: '120px'
                }}
                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '38px';
                  if (target.scrollHeight > 38) {
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }
                }}
                aria-label="Type your message"
              />
              <Button 
                type="submit" 
                className="get-started"
                style={{ 
                  width: '45px',
                  height: '45px',
                  borderRadius: '8px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Send message"
              >
                ➤
              </Button>
            </div>
          </Form>
          
          <Button 
            onClick={handleGetReport}
            className="get-started w-100 mt-2"
            style={{ fontSize: '1rem', fontWeight: 'bold', padding: '10px' }}
          >
            Get Report
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Chat;