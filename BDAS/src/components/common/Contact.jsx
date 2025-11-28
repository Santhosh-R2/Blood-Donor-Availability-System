import React from 'react';
import '../styles/Contact.css';
import { 
  LocationOn, Phone, Email, Send, 
  HelpOutline, Security, Speed, ArrowForward 
} from '@mui/icons-material';

const Contact = () => {
  return (
    <div className="contact-wrapper">
      
      {/* Decorative Background Pattern */}
      <div className="contact-bg-pattern"></div>

      {/* --- 1. Header Section --- */}
      <header className="contact-header">
        <div className="header-content">
          <span className="tagline">GET IN TOUCH</span>
          <h1>We'd Love to Hear from You</h1>
          <p className="header-desc">
            Have a question about donating? Need technical support for your hospital dashboard? 
            Our team is ready to help you save lives.
          </p>
        </div>
      </header>

      {/* --- 2. Main Content --- */}
      <div className="contact-container">
        
        {/* Left Column: Contact Info & Map */}
        <div className="info-column">
          {/* Contact Cards */}
          <div className="info-grid">
            <div className="info-card">
              <div className="icon-box"><LocationOn /></div>
              <div className="info-text">
                <h4>Headquarters</h4>
                <p>123 Health Avenue, Tech Park<br />New York, NY 10012</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-box"><Phone /></div>
              <div className="info-text">
                <h4>Phone Support</h4>
                <p>+1 (555) 123-4567<br /><span className="sub-text">Mon-Fri, 9am - 6pm</span></p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-box"><Email /></div>
              <div className="info-text">
                <h4>Email Us</h4>
                <p>support@bloodlink.com<br />partners@bloodlink.com</p>
              </div>
            </div>
          </div>

          {/* Map - Now flex-grow to fill space */}
          <div className="map-wrapper">
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

        {/* Right Column: Contact Form */}
        <div className="form-column">
          <form className="contact-form">
            <div className="form-head">
              <h3>Send us a Message</h3>
              <p>We usually reply within 24 hours.</p>
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. John Doe" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select>
                <option>General Inquiry</option>
                <option>Hospital Partnership</option>
                <option>Technical Issue</option>
                <option>Report a Bug</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="How can we help you?" rows="5"></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Send Message <Send sx={{ fontSize: 18, ml: 1 }} />
            </button>
          </form>
        </div>
      </div>

      {/* --- 3. PRO FAQ Section --- */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Find quick answers to common questions about blood donation.</p>
          </div>
          
          <div className="faq-grid">
            
            {/* FAQ Item 1 */}
            <div className="faq-card">
              <div className="faq-icon-wrapper">
                <HelpOutline sx={{ fontSize: 28 }} />
              </div>
              <div className="faq-content">
                <h4>How do I register as a donor?</h4>
                <p>Click on the "Register" button on the homepage, fill in your details and blood type. It takes less than 2 minutes to join our hero network.</p>
                <a href="/register" className="faq-link">Register Now <ArrowForward sx={{ fontSize: 16 }} /></a>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="faq-card">
              <div className="faq-icon-wrapper">
                <Security sx={{ fontSize: 28 }} />
              </div>
              <div className="faq-content">
                <h4>Is my data secure?</h4>
                <p>Absolutely. We use industry-standard encryption (JWT & AES) and never share your personal details with anyone except the hospital.</p>
                <a href="/privacy" className="faq-link">Read Privacy Policy <ArrowForward sx={{ fontSize: 16 }} /></a>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="faq-card">
              <div className="faq-icon-wrapper">
                <Speed sx={{ fontSize: 28 }} />
              </div>
              <div className="faq-content">
                <h4>How fast do alerts arrive?</h4>
                <p>Our system is real-time. Once a hospital broadcasts a request, compatible donors within a 10km radius receive SMS alerts within 30s.</p>
                <a href="/about" className="faq-link">Learn How it Works <ArrowForward sx={{ fontSize: 16 }} /></a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Contact;