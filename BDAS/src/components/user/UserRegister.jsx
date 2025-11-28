import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Person, Email, Phone, Home, LocationCity, 
  Map, PinDrop, Lock, Visibility, VisibilityOff,
  Cake, Male
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; // 1. Import Toast
import 'react-toastify/dist/ReactToastify.css'; // 2. Import CSS
import '../styles/UserRegisterLogin.css';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  // Error State
  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validation Logic
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        tempErrors[key] = "This field is required";
        isValid = false;
      }
    });

    if (formData.age && parseInt(formData.age) <= 18) {
      tempErrors.age = "You must be over 18 to register.";
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    
    // Optional: Show toast if form is invalid
    if (!isValid) {
      toast.error("Please fix the errors in the form.");
    }
    
    return isValid;
  };

  // --- API CONNECTION HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      
      try {
        const response = await fetch("http://localhost:5001/User/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Success: Show Toast
          toast.success("Registration Successful! Redirecting to login...", {
            position: "top-right",
            autoClose: 2000, // Close after 2 seconds
          });
          
          console.log("Success:", data);
          
          // Wait 2 seconds before navigating so user sees the toast
          setTimeout(() => {
            navigate('/login');
          }, 2000);

        } else {
          // Error: Show Toast
          toast.error(data.message || "Registration Failed", {
            position: "top-center"
          });
          console.error("Error:", data);
        }
      } catch (error) {
        // Network Error: Show Toast
        console.error("Network Error:", error);
        toast.error("Server not responding. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      {/* 3. Add Toast Container Component */}
      <ToastContainer />
      
      <div className="auth-container register-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the BloodLink community to save lives.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* --- Personal Details --- */}
          <h4 className="form-section-title">Personal Details</h4>
          <div className="form-grid">
            <div className="input-group">
              <Person className="input-icon" />
              <input 
                type="text" name="fullName" placeholder="Full Name"
                value={formData.fullName} onChange={handleChange}
                className={errors.fullName ? 'error-input' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="input-group">
              <Cake className="input-icon" />
              <input 
                type="number" name="age" placeholder="Age"
                value={formData.age} onChange={handleChange}
                className={errors.age ? 'error-input' : ''}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

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

          {/* --- Contact Details --- */}
          <h4 className="form-section-title">Contact Info</h4>
          <div className="form-grid">
            <div className="input-group">
              <Phone className="input-icon" />
              <input 
                type="text" name="mobile" placeholder="Mobile Number"
                value={formData.mobile} onChange={handleChange}
                className={errors.mobile ? 'error-input' : ''}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="input-group">
              <Email className="input-icon" />
              <input 
                type="email" name="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          {/* --- Address Details --- */}
          <h4 className="form-section-title">Address Details</h4>
          <div className="form-grid full-width">
            <div className="input-group">
              <Home className="input-icon" />
              <input 
                type="text" name="address" placeholder="Address Line (House No, Street)"
                value={formData.address} onChange={handleChange}
                className={errors.address ? 'error-input' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>
          
          <div className="form-grid">
            <div className="input-group">
              <LocationCity className="input-icon" />
              <input 
                type="text" name="city" placeholder="City"
                value={formData.city} onChange={handleChange}
                className={errors.city ? 'error-input' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="input-group">
              <Map className="input-icon" />
              <input 
                type="text" name="state" placeholder="State"
                value={formData.state} onChange={handleChange}
                className={errors.state ? 'error-input' : ''}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            <div className="input-group">
              <PinDrop className="input-icon" />
              <input 
                type="text" name="pincode" placeholder="Pincode"
                value={formData.pincode} onChange={handleChange}
                className={errors.pincode ? 'error-input' : ''}
              />
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            </div>
          </div>

          {/* --- Security --- */}
          <h4 className="form-section-title">Security</h4>
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

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;