import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  Edit, 
  Save, 
  Close, 
  Person, 
  ContactPhone, 
  Home 
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Stats State
  const [totalRequests, setTotalRequests] = useState(0);

  // Form Data State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    age: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    createdAt: ''
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo || !userInfo.token) {
          toast.error("Session expired. Please login.");
          setFetchLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // A. Fetch Profile
        const profileRes = await axios.get("http://localhost:5001/User/profile", config);
        const data = profileRes.data;

        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          mobile: data.mobile || '',
          age: data.age || '',
          gender: data.gender || 'Male',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          createdAt: data.createdAt
        });

        // B. Fetch Request Count
        try {
            const requestRes = await axios.get("http://localhost:5001/api/requests/my-requests", config);
            setTotalRequests(requestRes.data.length);
        } catch (reqError) {
            setTotalRequests(0);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. INPUT HANDLER WITH REGEX RESTRICTIONS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // A. Alphabets Only (Name, City, State)
    if (name === 'fullName' || name === 'city' || name === 'state') {
        const alphabetRegex = /^[a-zA-Z\s]*$/;
        if (alphabetRegex.test(value)) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // B. Numbers Only (Mobile, Pincode, Age)
    else if (name === 'mobile') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 10) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'pincode') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 6) {
            setFormData({ ...formData, [name]: value });
        }
    }
    else if (name === 'age') {
        const numberRegex = /^\d*$/;
        if (numberRegex.test(value) && value.length <= 3) {
            setFormData({ ...formData, [name]: value });
        }
    }
    // C. Default (Address, Gender, etc.)
    else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // --- 3. VALIDATION LOGIC ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Full Name
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    // Email (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid Email Address.";
      isValid = false;
    }

    // Age (> 18)
    if (!formData.age || parseInt(formData.age) < 18) {
      tempErrors.age = "Must be 18 or older.";
      isValid = false;
    }

    // Mobile (Exactly 10)
    if (!formData.mobile || formData.mobile.length !== 10) {
      tempErrors.mobile = "Mobile Number must be 10 digits.";
      isValid = false;
    }

    // Pincode (Exactly 6)
    if (!formData.pincode || formData.pincode.length !== 6) {
      tempErrors.pincode = "Pincode must be 6 digits.";
      isValid = false;
    }

    // City & State
    if (!formData.city.trim()) {
      tempErrors.city = "City is required.";
      isValid = false;
    }
    if (!formData.state.trim()) {
      tempErrors.state = "State is required.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- 4. UPDATE USER PROFILE ---
  const handleSave = async () => {
    
    // Run Validation
    if (!validateForm()) {
        toast.error("Please fix the errors in the form.");
        return;
    }

    setSaveLoading(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      const config = {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}` 
        },
      };

      const { data } = await axios.put("http://localhost:5001/User/profile", formData, config);

      // Update LocalStorage
      const updatedLocalStorage = {
        ...userInfo,
        fullName: data.fullName,
        mobile: data.mobile
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedLocalStorage));

      toast.success("Profile Updated Successfully!");
      setIsEditing(false);

    } catch (error) {
      console.error("Update Error:", error);
      const message = error.response && error.response.data.message 
        ? error.response.data.message 
        : "Update failed. Please try again.";
      toast.error(message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Layout Sidebar={UserSidebar}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="profile-container">
        
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account details and preferences.</p>
        </div>

        {fetchLoading ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress style={{ color: '#3b82f6' }} />
            </div>
        ) : (
            <div className="profile-grid">
            
            {/* --- LEFT COLUMN: Summary Card --- */}
            <div className="profile-card">
                <div className="profile-avatar-wrapper">
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <h2 className="profile-name">{formData.fullName}</h2>
                <span className="profile-role">User Account</span>

                <div className="profile-stats">
                <div className="stat-box">
                    <h4>{totalRequests}</h4>
                    <span>Requests</span>
                </div>
                <div className="stat-box">
                    <h4 style={{color: '#22c55e'}}>Active</h4>
                    <span>Status</span>
                </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Detailed Form --- */}
            <div className="details-card">
                
                <div className="details-header">
                <h3 style={{margin:0, fontSize: '1.2rem', color: '#1e293b'}}>Personal Details</h3>
                {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    <Edit fontSize="small" style={{marginRight: 5}}/> Edit Profile
                    </button>
                )}
                </div>

                <form className={isEditing ? 'editing' : ''}>
                
                {/* Section 1: Basic Info */}
                <div className="section-label">
                    <Person fontSize="small" style={{color: '#3b82f6'}} /> Basic Information
                </div>
                <div className="form-row">
                    <div className="input-group">
                    <label>Full Name (Alphabets Only)</label>
                    <input 
                        type="text" name="fullName" 
                        className={`input-field ${errors.fullName ? 'input-error' : ''}`} 
                        value={formData.fullName} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>
                    
                    <div className="input-group">
                    <label>Email Address</label>
                    <input 
                        type="email" name="email" 
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                        value={formData.email} 
                        disabled={true} 
                        style={{cursor: 'not-allowed', opacity: 0.7}}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                    <label>Age (18+)</label>
                    <input 
                        type="text" name="age" 
                        className={`input-field ${errors.age ? 'input-error' : ''}`}
                        value={formData.age} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.age && <span className="error-text">{errors.age}</span>}
                    </div>
                    
                    <div className="input-group">
                    <label>Gender</label>
                    <select 
                        name="gender" 
                        className="input-field" 
                        value={formData.gender} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                </div>

                {/* Section 2: Contact */}
                <div className="section-label" style={{marginTop: '30px'}}>
                    <ContactPhone fontSize="small" style={{color: '#3b82f6'}} /> Contact Information
                </div>
                <div className="form-row">
                    <div className="input-group">
                    <label>Mobile Number (10 Digits)</label>
                    <input 
                        type="text" name="mobile" 
                        className={`input-field ${errors.mobile ? 'input-error' : ''}`}
                        value={formData.mobile} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                    </div>
                </div>

                {/* Section 3: Address */}
                <div className="section-label" style={{marginTop: '30px'}}>
                    <Home fontSize="small" style={{color: '#3b82f6'}} /> Address Details
                </div>
                <div className="form-row">
                    <div className="input-group">
                    <label>Street Address</label>
                    <input 
                        type="text" name="address" 
                        className="input-field" 
                        value={formData.address} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    </div>
                    <div className="input-group">
                    <label>City (Alphabets Only)</label>
                    <input 
                        type="text" name="city" 
                        className={`input-field ${errors.city ? 'input-error' : ''}`}
                        value={formData.city} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                    <label>State (Alphabets Only)</label>
                    <input 
                        type="text" name="state" 
                        className={`input-field ${errors.state ? 'input-error' : ''}`}
                        value={formData.state} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                    </div>
                    <div className="input-group">
                    <label>Pincode (6 Digits)</label>
                    <input 
                        type="text" name="pincode" 
                        className={`input-field ${errors.pincode ? 'input-error' : ''}`}
                        value={formData.pincode} 
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="action-buttons">
                    <button type="button" className="save-btn" onClick={handleSave} disabled={saveLoading}>
                        {saveLoading ? "Saving..." : <><Save fontSize="small" style={{marginRight:5, verticalAlign:'middle'}}/> Save Changes</>}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)} disabled={saveLoading}>
                        <Close fontSize="small" style={{marginRight:5, verticalAlign:'middle'}}/> Cancel
                    </button>
                    </div>
                )}

                </form>
            </div>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;