import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import '../styles/UserLogin.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading State

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- API INTEGRATION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setLoading(true); // Start loading spinner/disable button

      try {
        const response = await fetch("http://localhost:5001/User/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // 1. Success: Save Token/User Data to LocalStorage
          localStorage.setItem("userInfo", JSON.stringify(data));
          
          // 2. Show Success Toast
          toast.success("Login Successful! Welcome back.", {
            position: "top-right",
            autoClose: 2000,
          });

          console.log("Login Success:", data);

          // 3. Redirect to Dashboard/Home after short delay
          setTimeout(() => {
            navigate('/'); 
          }, 2000);

        } else {
          // 4. API Error (Wrong password, User not found)
          toast.error(data.message || "Invalid Email or Password", {
            position: "top-center"
          });
        }

      } catch (error) {
        // 5. Network/Server Error
        console.error("Network Error:", error);
        toast.error("Server not responding. Check your connection.");
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="user-log-wrapper">
      <ToastContainer />
      <div className="user-log-container">
        
        {/* Left Side - Image/Welcome */}
        <div className="user-log-image-side">
          <div className="user-log-overlay">
            <h1>Welcome Back!</h1>
            <p>Every drop counts. Log in to manage your donations and connect with those in need.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="user-log-form-side">
          <div className="user-log-header">
            <h2>User Login</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="user-log-form">
            
            {/* Email Input */}
            <div className="user-log-input-group">
              <input 
                type="text" 
                name="email" 
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'user-log-error-border' : ''}
              />
              <Email className="user-log-icon" />
              {errors.email && <span className="user-log-error-text">{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div className="user-log-input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'user-log-error-border' : ''}
              />
              <Lock className="user-log-icon" />
              <div 
                className="user-log-password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
              {errors.password && <span className="user-log-error-text">{errors.password}</span>}
            </div>

            {/* Options */}
            <div className="user-log-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="user-log-btn" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>

            {/* Footer */}
            <p className="user-log-footer">
              Don't have an account? <Link to="/register/user">Register now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;