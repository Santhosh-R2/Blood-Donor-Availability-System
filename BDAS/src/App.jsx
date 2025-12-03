
import React from 'react'
import LandingPage from './components/common/LandingPage'
import About from './components/common/About'
import Contact from './components/common/Contact'
import {Routes,Route, BrowserRouter}from 'react-router-dom'
import Navbar from './components/common/Navbar'
import UserLogin from './components/user/UserLogin'
import UserRegister from './components/user/UserRegister'
import DonorRegister from './components/donors/DonorRegister'
import HospitalRegister from './components/hospitals/HospitalRegister'
import DonorLogin from './components/donors/DonorLogin'
import HospitalLogin from './components/hospitals/HospitalLogin'
import UserForgotPassword from './components/user/UserForgotPassword'
import DonorForgotPassword from './components/donors/DonorForgotPassword'
import HospitalForgotPassword from './components/hospitals/HospitalForgotPassword'
import AdminLogin from './components/admin/AdminLogin'
import AdminForgotPassword from './components/admin/AdminForgotPassword'
import UserDashboard from './components/user/UserDashboard'
import RequestBlood from './components/user/RequestBlood'
import UserHistory from './components/user/UserHistory'
import UserProfile from './components/user/UserProfile'
import BloodBank from './components/user/BloodBank'
import DonorDashboard from './components/donors/DonorDashboard';
import DonateNow from './components/donors/DonateNow';
import DonorHistory from './components/donors/DonorHistory'
import DonorProfile from './components/donors/DonorProfile'
import HospitalDashboard from './components/hospitals/HospitalDashboard';
import HospitalInventory from './components/hospitals/HospitalInventory';
import HospitalRequests from './components/hospitals/HospitalRequests'
import HospitalProfile from './components/hospitals/HospitalProfile'
import AdminDashboard from './components/admin/AdminDashboard'
import ManageUsers from './components/admin/ManageUsers'
import ManageDonors from './components/admin/ManageDonors'
import ManageHospitals from './components/admin/ManageHospitals'
import AllRequests from './components/admin/AllRequests'
import AdminMessages from './components/admin/AdminMessages'
const App = () => {
  return (
    <div>
    {/* <UserRegister/> */}
<BrowserRouter>
<Routes>
  <Route path='/' element={<LandingPage/>}/>
  <Route path='/about' element={<About/>}/>
  <Route path='/contact' element={<Contact/>}/>
    <Route path='/register/user' element={<UserRegister/>}/>
    <Route path='/register/donor' element={<DonorRegister/>}/>
<Route path='/register/hospital' element={<HospitalRegister/>}/>
<Route path='/login/user' element={<UserLogin/>}/>
<Route path='/login/donor' element={<DonorLogin/>}/>
<Route path='/login/hospital' element={<HospitalLogin/>}/>
<Route path="/forgot-password-user" element={<UserForgotPassword />} />
<Route path="/forgot-password-doner" element={<DonorForgotPassword />} />
<Route path="/forgot-password-hospital" element={<HospitalForgotPassword />} />
<Route path="/login/admin" element={<AdminLogin />} />
<Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

<Route path="/user/dashboard" element={<UserDashboard />} />
<Route path="/user/request" element={<RequestBlood />} />
<Route path="/user/historyInfo" element={<UserHistory />} />
<Route path="/user/profile" element={<UserProfile />} />
<Route path="/user/blood-bank" element={<BloodBank />} />
<Route path="/donor/dashboard" element={<DonorDashboard />} />
<Route path="/donor/donate" element={<DonateNow />} />
<Route path="/donor/history" element={<DonorHistory />} />
<Route path="/donor/profile" element={<DonorProfile />} />
<Route path="/hospital/dashboard" element={<HospitalDashboard />} />
<Route path="/hospital/inventory" element={<HospitalInventory />} />
<Route path="/hospital/requests" element={<HospitalRequests />} />
<Route path="/hospital/profile" element={<HospitalProfile />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/users" element={<ManageUsers />} />
<Route path="/admin/donors" element={<ManageDonors />} />
<Route path="/admin/hospitals" element={<ManageHospitals />} />
<Route path="/admin/requests" element={<AllRequests />} />
<Route path="/admin/messages" element={<AdminMessages />} />

</Routes>
</BrowserRouter>
    </div>
  )
}

export default App