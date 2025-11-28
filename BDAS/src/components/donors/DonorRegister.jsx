import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Person, Email, Phone, Lock, Visibility, VisibilityOff,
  CalendarToday, Bloodtype, MonitorWeight, Male,
  MedicalServices, Healing
} from '@mui/icons-material';
import '../styles/DonorRegister.css'; // We will use the same styles

const DonorRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // --- Form State ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    lastDonationDate: '',
    hasDisease: '', // 'yes' or 'no'
    hadSurgery: '', // 'yes' or 'no'
    password: '',
    confirmPassword: ''
  });

  // --- Error State ---
  const [errors, setErrors] = useState({});

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on type
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // --- Validation Logic ---
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. Required Fields
    const requiredFields = ['fullName', 'email', 'mobile', 'dob', 'gender', 'bloodGroup', 'weight', 'password', 'confirmPassword'];
    requiredFields.forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    // 2. Mobile (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }

    // 3. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email.";
      isValid = false;
    }

    // 4. Weight (Must be > 45kg for donation)
    if (formData.weight && parseInt(formData.weight) < 45) {
      tempErrors.weight = "Weight must be at least 45kg to donate.";
      isValid = false;
    }

    // 5. Age Check (Approximate based on DOB)
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        tempErrors.dob = "You must be at least 18 years old.";
        isValid = false;
      }
    }

    // 6. Password Match
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Donor Registration Data:", formData);
      alert("Registration Successful! Welcome to the hero community.");
      navigate('/'); 
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container register-container">
        <div className="auth-header">
          <h2>Become a Donor</h2>
          <p>Your blood can be the lifeline for someone in need.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* --- Section 1: Personal Details --- */}
          <h4 className="form-section-title">Personal Details</h4>
          <div className="form-grid">
            
            {/* Full Name */}
            <div className="input-group full-width">
              <Person className="input-icon" />
              <input 
                type="text" name="fullName" placeholder="Full Name"
                value={formData.fullName} onChange={handleChange}
                className={errors.fullName ? 'error-input' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="input-group">
              <Email className="input-icon" />
              <input 
                type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Mobile */}
            <div className="input-group">
              <Phone className="input-icon" />
              <input 
                type="text" name="mobile" placeholder="Mobile Number"
                value={formData.mobile} onChange={handleChange}
                className={errors.mobile ? 'error-input' : ''}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            {/* DOB */}
            <div className="input-group">
              <CalendarToday className="input-icon" />
              <input 
                type="text" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                name="dob" placeholder="Date of Birth"
                value={formData.dob} onChange={handleChange}
                className={errors.dob ? 'error-input' : ''}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>
            
             {/* Gender */}
             <div className="input-group">
              <Male className="input-icon" />
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className={errors.gender ? 'error-input' : ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
          </div>

          {/* --- Section 2: Medical & Physical Stats --- */}
          <h4 className="form-section-title">Donor Eligibility</h4>
          <div className="form-grid">
            
            {/* Blood Group */}
            <div className="input-group">
              <Bloodtype className="input-icon" />
              <select 
                name="bloodGroup" 
                value={formData.bloodGroup} 
                onChange={handleChange}
                className={errors.bloodGroup ? 'error-input' : ''}
              >
                <option value="">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodGroup && <span className="error-text">{errors.bloodGroup}</span>}
            </div>

            {/* Weight */}
            <div className="input-group">
              <MonitorWeight className="input-icon" />
              <input 
                type="number" name="weight" placeholder="Weight (kg)"
                value={formData.weight} onChange={handleChange}
                className={errors.weight ? 'error-input' : ''}
              />
              {errors.weight && <span className="error-text">{errors.weight}</span>}
            </div>

            {/* Last Donation */}
            <div className="input-group full-width">
              <CalendarToday className="input-icon" />
              <input 
                type="text" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                name="lastDonationDate" placeholder="Last Donation Date (Optional)"
                value={formData.lastDonationDate} onChange={handleChange}
              />
            </div>

            {/* Disease Check */}
            <div className="input-group">
              <MedicalServices className="input-icon" />
              <select 
                name="hasDisease" 
                value={formData.hasDisease} 
                onChange={handleChange}
              >
                <option value="">Any Chronic Disease?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Surgery Check */}
            <div className="input-group">
              <Healing className="input-icon" />
              <select 
                name="hadSurgery" 
                value={formData.hadSurgery} 
                onChange={handleChange}
              >
                <option value="">Surgery in last 6 months?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* --- Section 3: Security --- */}
          <h4 className="form-section-title">Account Security</h4>
          <div className="form-grid">
            <div className="input-group">
              <Lock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password"
                value={formData.password} 
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm Password"
                value={formData.confirmPassword} 
                onChange={handleChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn-auth">Register as Donor</button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DonorRegister;