import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Contact.css';
import { 
  LocationOn, Phone, Email, Send, 
  HelpOutline, Security, Speed, ArrowForward 
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const role = userInfo ? (userInfo.role || 'User') : 'Guest';

      const payload = {
        ...formData,
        role: role
      };

      await axios.post("http://localhost:5001/api/contact", payload);

      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });

    } catch (error) {
      console.error("Contact Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
< Navbar/>
    <div className="contact-msg-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="contact-msg-bg-pattern"></div>

      <header className="contact-msg-header">
        <div className="contact-msg-header-content">
          <span className="contact-msg-tagline">GET IN TOUCH</span>
          <h1>We'd Love to Hear from You</h1>
          <p className="contact-msg-header-desc">
            Have a question about donating? Need technical support for your hospital dashboard? 
            Our team is ready to help you save lives.
          </p>
        </div>
      </header>

      <div className="contact-msg-container">
        
        <div className="contact-msg-info-column">
          <div className="contact-msg-info-grid">
            <div className="contact-msg-info-card">
              <div className="contact-msg-icon-box"><LocationOn /></div>
              <div className="contact-msg-info-text">
                <h4>Headquarters</h4>
                <p>123 Health Avenue, Tech Park<br />New York, NY 10012</p>
              </div>
            </div>
            <div className="contact-msg-info-card">
              <div className="contact-msg-icon-box"><Phone /></div>
              <div className="contact-msg-info-text">
                <h4>Phone Support</h4>
                <p>+1 (555) 123-4567<br /><span className="contact-msg-sub-text">Mon-Fri, 9am - 6pm</span></p>
              </div>
            </div>
            <div className="contact-msg-info-card">
              <div className="contact-msg-icon-box"><Email /></div>
              <div className="contact-msg-info-text">
                <h4>Email Us</h4>
                <p>support@bloodlink.com<br />partners@bloodlink.com</p>
              </div>
            </div>
          </div>

          <div className="contact-msg-map-wrapper">
            <iframe 
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1622652929273!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="contact-msg-form-column">
          <form className="contact-msg-form" onSubmit={handleSubmit}>
            <div className="contact-msg-form-head">
              <h3>Send us a Message</h3>
              <p>We usually reply within 24 hours.</p>
            </div>
            
            <div className="contact-msg-form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe" 
                required
              />
            </div>

            <div className="contact-msg-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com" 
                required
              />
            </div>

            <div className="contact-msg-form-group">
              <label>Subject</label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option>General Inquiry</option>
                <option>Hospital Partnership</option>
                <option>Technical Issue</option>
                <option>Report a Bug</option>
              </select>
            </div>

            <div className="contact-msg-form-group">
              <label>Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?" 
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-msg-btn-submit" disabled={loading}>
              {loading ? "Sending..." : <>Send Message <Send sx={{ fontSize: 18, ml: 1 }} /></>}
            </button>
          </form>
        </div>
      </div>

      <section className="contact-msg-faq-section">
        <div className="contact-msg-faq-container">
          <div className="contact-msg-section-title">
            <h2>Frequently Asked Questions</h2>
            <div className="contact-msg-title-underline"></div>
            <p className="contact-msg-section-subtitle">Find quick answers to common questions about blood donation.</p>
          </div>
          
          <div className="contact-msg-faq-grid">
            <div className="contact-msg-faq-card">
              <div className="contact-msg-faq-icon-wrapper"><HelpOutline sx={{ fontSize: 28 }} /></div>
              <div className="contact-msg-faq-content">
                <h4>How do I register as a donor?</h4>
                <p>Click on the "Register" button on the homepage, fill in your details and blood type.</p>
                {/* <a href="/register" className="contact-msg-faq-link">Register Now <ArrowForward sx={{ fontSize: 16 }} /></a> */}
              </div>
            </div>
            <div className="contact-msg-faq-card">
              <div className="contact-msg-faq-icon-wrapper"><Security sx={{ fontSize: 28 }} /></div>
              <div className="contact-msg-faq-content">
                <h4>Is my data secure?</h4>
                <p>Absolutely. We use industry-standard encryption (JWT & AES) and never share your details.</p>
                {/* <a href="/privacy" className="contact-msg-faq-link">Read Privacy Policy <ArrowForward sx={{ fontSize: 16 }} /></a> */}
              </div>
            </div>
            <div className="contact-msg-faq-card">
              <div className="contact-msg-faq-icon-wrapper"><Speed sx={{ fontSize: 28 }} /></div>
              <div className="contact-msg-faq-content">
                <h4>How fast do alerts arrive?</h4>
                <p>Our system is real-time. Compatible donors receive notifications instantly.</p>
                {/* <a href="/about" className="contact-msg-faq-link">Learn How it Works <ArrowForward sx={{ fontSize: 16 }} /></a> */}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
        </div>

  );
}

export default Contact;