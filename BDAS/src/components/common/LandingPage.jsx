
import React from 'react';
import '../styles/LandingPage.css'; // Import the external CSS

// Images
import img1 from '../../assets/img1.jpg'; // Hero / Main
import img2 from '../../assets/img2.jpg'; // Feature 1
import img3 from '../../assets/img3.jpg'; // Feature 2
import img4 from '../../assets/img4.jpg'; // Feature 3
import Footer from './Footer';
import Navbar from './Navbar';

const LandingPage = () => {
  return (
    <div className="landing-page">
      
      {/* --- Navbar --- */}
  <Navbar/>

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="badge">v2.0 Beta Live</span>
          <h1>Every Drop Counts.<br />Save a Life Today.</h1>
          <p>
            An advanced platform bridging the gap between donors and hospitals. 
            Real-time tracking, instant alerts, and seamless communication.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Find a Donor</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </header>

      {/* --- Zig-Zag Sections Container --- */}
      <div className="container">
        
        {/* Section 1: Image Left, Text Right */}
        <section className="row-section">
          <div className="image-wrapper">
            <img src={img1} alt="Community Donation" />
            <div className="img-decoration"></div>
          </div>
          <div className="text-wrapper">
            <h4 className="sub-heading">OUR MISSION</h4>
            <h2>Building a Healthier Community</h2>
            <p>
              We believe that no life should be lost due to a lack of blood. 
              Our system connects willing donors with patients in critical need 
              within milliseconds, ensuring that help arrives when it matters most.
            </p>
            <ul className="feature-list">
              <li>24/7 Emergency Support</li>
              <li>Real-time Location Tracking</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Text Left, Image Right (Zig-Zag) */}
        <section className="row-section reverse">
          <div className="image-wrapper">
            <img src={img2} alt="Donor Registration" />
            <div className="img-decoration"></div>
          </div>
          <div className="text-wrapper">
            <h4 className="sub-heading">FOR DONORS</h4>
            <h2>Become a Hero in Minutes</h2>
            <p>
              Registration is simple and secure. Create your profile, log your blood type, 
              and receive instant SMS alerts when a nearby hospital needs your specific help.
              Track your donation history and see the lives you've impacted.
            </p>
            <button className="btn-text">Register as Donor &rarr;</button>
          </div>
        </section>

        {/* Section 3: Image Left, Text Right */}
        <section className="row-section">
          <div className="image-wrapper">
            <img src={img3} alt="Hospital Dashboard" />
            <div className="img-decoration"></div>
          </div>
          <div className="text-wrapper">
            <h4 className="sub-heading">FOR HOSPITALS</h4>
            <h2>Advanced Inventory Management</h2>
            <p>
              Medical institutions can manage blood stock levels in real-time. 
              In emergencies, trigger a broadcast to all compatible donors within 
              a 10km radius instantly using our automated dispatch system.
            </p>
            <button className="btn-text">Partner with Us &rarr;</button>
          </div>
        </section>

        {/* Section 4: Text Left, Image Right (Zig-Zag) */}
        <section className="row-section reverse">
          <div className="image-wrapper">
            <img src={img4} alt="Mobile Technology" />
            <div className="img-decoration"></div>
          </div>
          <div className="text-wrapper">
            <h4 className="sub-heading">THE TECHNOLOGY</h4>
            <h2>Powered by Modern Tech</h2>
            <p>
              Built on a robust stack ensuring 99.9% uptime. Our application is 
              optimized for low-bandwidth areas, ensuring that rural clinics 
              can access the network just as easily as city hospitals.
            </p>
          </div>
        </section>

      </div>

      <Footer/>

    </div>
  );
}

export default LandingPage;