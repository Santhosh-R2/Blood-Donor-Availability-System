import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../common/Layout';
import UserSidebar from './UserSidebar';
import { 
  LocalFireDepartment, 
  AccessTime, 
  CheckCircle, 
  Person, 
  LocalHospital, 
  Send 
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/RequestBlood.css';

const RequestBlood = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // --- Urgency State ---
  const [urgency, setUrgency] = useState('moderate'); 

  // --- Form Data ---
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    reason: '',
    hospitalName: '',
    doctorName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    units: 1 // Default is 1
  });

  // --- VALIDATION & CHANGE HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Validation for Patient Name & Doctor Name (Alphabets & Spaces only)
    if (name === 'patientName' || name === 'doctorName') {
      const alphabetRegex = /^[a-zA-Z\s]*$/;
      if (alphabetRegex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } 
    // 2. Validation for Hospital Phone (Numbers only)
    else if (name === 'hospitalPhone') {
      const numberRegex = /^\d*$/; // Only digits 0-9
      if (numberRegex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    }
    // 3. Default handler for other fields
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- API SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.bloodGroup || !formData.hospitalName || !formData.hospitalAddress) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const requestPayload = {
        ...formData,
        urgency,
        units: 1 // Ensure 1 is always sent
      };

      const response = await axios.post(
        "http://localhost:5001/api/requests/create", 
        requestPayload, 
        config
      );

      if (response.data) {
        toast.success("Blood Request Submitted Successfully!");
        
        setFormData({
          patientName: '', age: '', gender: '', bloodGroup: '', reason: '',
          hospitalName: '', doctorName: '', hospitalAddress: '', hospitalPhone: '', units: 1
        });
        setUrgency('moderate');

        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      }

    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : "Failed to submit request. Please try again.";
      
      console.error("API Error:", error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout Sidebar={UserSidebar}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="request-container">
        
        <div className="page-header">
          <h2>Create Blood Request</h2>
          <p>Fill in the patient and hospital details to notify nearby donors.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* 1. URGENCY SELECTOR */}
          <div className="urgency-grid">
            <div 
              className={`urgency-card ${urgency === 'critical' ? 'active critical' : ''}`}
              onClick={() => setUrgency('critical')}
            >
              <LocalFireDepartment className="urgency-icon" />
              <h4>Emergency</h4>
              <p style={{fontSize:'0.8rem', margin:0}}>Immediate Requirement (2-4 hrs)</p>
            </div>

            <div 
              className={`urgency-card ${urgency === 'moderate' ? 'active moderate' : ''}`}
              onClick={() => setUrgency('moderate')}
            >
              <AccessTime className="urgency-icon" />
              <h4>Urgent</h4>
              <p style={{fontSize:'0.8rem', margin:0}}>Required within 24 hrs</p>
            </div>

            <div 
              className={`urgency-card ${urgency === 'low' ? 'active low' : ''}`}
              onClick={() => setUrgency('low')}
            >
              <CheckCircle className="urgency-icon" />
              <h4>Standard</h4>
              <p style={{fontSize:'0.8rem', margin:0}}>Planned Surgery / Future Need</p>
            </div>
          </div>

          {/* 2. PATIENT DETAILS */}
          <div className="section-title">
            <Person style={{color: '#d32f2f'}} /> Patient Information
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Patient Name * (Alphabets Only)</label>
              <input 
                type="text" 
                name="patientName" 
                className="form-input" 
                placeholder="Enter full name" 
                value={formData.patientName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Blood Group Required *</label>
              <select 
                name="bloodGroup" className="form-input" 
                value={formData.bloodGroup} onChange={handleChange} required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input 
                type="number" name="age" className="form-input" 
                placeholder="Age" value={formData.age} 
                onChange={handleChange} required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select 
                name="gender" className="form-input" 
                value={formData.gender} onChange={handleChange} required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Units Required (Fixed)</label>
              <input 
                type="number" 
                name="units" 
                className="form-input" 
                value={1} // Locked value
                readOnly // Prevents typing
                style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} // Visual cue
              />
            </div>

            <div className="form-group">
              <label>Reason / Condition</label>
              <input 
                type="text" name="reason" className="form-input" 
                placeholder="e.g. Surgery, Accident, Dengue" 
                value={formData.reason} onChange={handleChange} 
              />
            </div>
          </div>

          {/* 3. HOSPITAL DETAILS */}
          <div className="section-title">
            <LocalHospital style={{color: '#d32f2f'}} /> Hospital Details
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Hospital Name *</label>
              <input 
                type="text" name="hospitalName" className="form-input" 
                placeholder="Enter Hospital Name" value={formData.hospitalName} 
                onChange={handleChange} required 
              />
            </div>

            <div className="form-group">
              <label>Attending Doctor (Alphabets Only)</label>
              <input 
                type="text" 
                name="doctorName" 
                className="form-input" 
                placeholder="Doctor's Name" 
                value={formData.doctorName} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Hospital Phone Line (Numbers Only)</label>
              <input 
                type="text" 
                name="hospitalPhone" 
                className="form-input" 
                placeholder="Contact Number" 
                value={formData.hospitalPhone} 
                onChange={handleChange} 
                maxLength={15}
              />
            </div>

            <div className="form-group full-width">
              <label>Hospital Address / Ward No *</label>
              <textarea 
                name="hospitalAddress" className="form-input" 
                placeholder="Complete address for donor to reach..." 
                value={formData.hospitalAddress} onChange={handleChange} required
              ></textarea>
            </div>
          </div>

          {/* 4. SUBMIT */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : <><Send /> Submit Blood Request</>}
          </button>

        </form>
      </div>
    </Layout>
  );
};

export default RequestBlood;