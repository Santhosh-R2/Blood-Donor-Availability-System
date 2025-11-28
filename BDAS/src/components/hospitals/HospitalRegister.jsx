import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LocalHospital, Email, Phone, Lock, Visibility, VisibilityOff,
  Badge, Domain, LocationOn, MeetingRoom, Emergency, Language
} from '@mui/icons-material';
import '../styles/HospitalRegister.css'; 

const HospitalRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // --- Form State ---
  const [formData, setFormData] = useState({
    hospitalName: '',
    licenseNumber: '',
    ownershipType: '', // Govt, Private, etc.
    email: '',
    phone: '',
    emergencyPhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    totalBeds: '',
    password: '',
    confirmPassword: ''
  });

  // --- Error State ---
  const [errors, setErrors] = useState({});

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // --- Validation Logic ---
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // 1. Required Fields
    const requiredFields = ['hospitalName', 'licenseNumber', 'ownershipType', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'password', 'confirmPassword'];
    requiredFields.forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid official email.";
      isValid = false;
    }

    // 3. Phone Validation
    const phoneRegex = /^[0-9]{10,12}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      tempErrors.phone = "Enter a valid phone number.";
      isValid = false;
    }

    // 4. Password Match
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
      console.log("Hospital Data:", formData);
      alert("Registration Request Sent! Please wait for admin approval.");
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container register-container">
        <div className="auth-header">
          <h2>Register Hospital</h2>
          <p>Partner with BloodLink to manage inventory and save lives.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* --- Section 1: Organization Details --- */}
          <h4 className="form-section-title">Organization Details</h4>
          <div className="form-grid">
            
            {/* Hospital Name (Full Width) */}
            <div className="input-group full-width">
              <LocalHospital className="input-icon" />
              <input 
                type="text" name="hospitalName" placeholder="Hospital Name"
                value={formData.hospitalName} onChange={handleChange}
                className={errors.hospitalName ? 'error-input' : ''}
              />
              {errors.hospitalName && <span className="error-text">{errors.hospitalName}</span>}
            </div>

            {/* License Number */}
            <div className="input-group">
              <Badge className="input-icon" />
              <input 
                type="text" name="licenseNumber" placeholder="License / Reg Number"
                value={formData.licenseNumber} onChange={handleChange}
                className={errors.licenseNumber ? 'error-input' : ''}
              />
              {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
            </div>

            {/* Ownership Type */}
            <div className="input-group">
              <Domain className="input-icon" />
              <select 
                name="ownershipType" 
                value={formData.ownershipType} 
                onChange={handleChange}
                className={errors.ownershipType ? 'error-input' : ''}
              >
                <option value="">Ownership Type</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Non-Profit">Non-Profit / Charity</option>
                <option value="Military">Military</option>
              </select>
              {errors.ownershipType && <span className="error-text">{errors.ownershipType}</span>}
            </div>
          </div>

          {/* --- Section 2: Contact Info --- */}
          <h4 className="form-section-title">Contact Information</h4>
          <div className="form-grid">
            
            <div className="input-group">
              <Email className="input-icon" />
              <input 
                type="email" name="email" placeholder="Official Email"
                value={formData.email} onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input 
                type="text" name="phone" placeholder="General Enquiry Phone"
                value={formData.phone} onChange={handleChange}
                className={errors.phone ? 'error-input' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <Emergency className="input-icon" style={{color: '#d32f2f'}} />
              <input 
                type="text" name="emergencyPhone" placeholder="Emergency Hotline"
                value={formData.emergencyPhone} onChange={handleChange}
              />
            </div>

             <div className="input-group">
              <Language className="input-icon" />
              <input 
                type="text" name="website" placeholder="Website URL (Optional)"
                value={formData.website} onChange={handleChange}
              />
            </div>
          </div>

          {/* --- Section 3: Location --- */}
          <h4 className="form-section-title">Location & Facilities</h4>
          <div className="form-grid">
            
            <div className="input-group full-width">
              <LocationOn className="input-icon" />
              <input 
                type="text" name="address" placeholder="Complete Address"
                value={formData.address} onChange={handleChange}
                className={errors.address ? 'error-input' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="input-group">
              <input 
                type="text" name="city" placeholder="City"
                style={{paddingLeft: '15px'}} // Manual override since no icon
                value={formData.city} onChange={handleChange}
                className={errors.city ? 'error-input' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="input-group">
              <input 
                type="text" name="state" placeholder="State"
                style={{paddingLeft: '15px'}}
                value={formData.state} onChange={handleChange}
                className={errors.state ? 'error-input' : ''}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            <div className="input-group">
              <input 
                type="text" name="zipCode" placeholder="Zip Code"
                style={{paddingLeft: '15px'}}
                value={formData.zipCode} onChange={handleChange}
                className={errors.zipCode ? 'error-input' : ''}
              />
              {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
            </div>

             <div className="input-group">
              <MeetingRoom className="input-icon" />
              <input 
                type="number" name="totalBeds" placeholder="Total Bed Capacity"
                value={formData.totalBeds} onChange={handleChange}
              />
            </div>
          </div>

          {/* --- Section 4: Security --- */}
          <h4 className="form-section-title">Account Security</h4>
          <div className="form-grid">
            <div className="input-group">
              <Lock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Create Password"
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

          <button type="submit" className="btn-auth">Register Hospital</button>

          <p className="auth-footer">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegister;