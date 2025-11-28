
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
const App = () => {
  return (
    <div>
    {/* <UserRegister/> */}
<BrowserRouter>
<Navbar/>
<Routes>
  <Route path='/' element={<LandingPage/>}/>
  <Route path='/about' element={<About/>}/>
  <Route path='/contact' element={<Contact/>}/>
    <Route path='/register/user' element={<UserRegister/>}/>
    <Route path='/register/donor' element={<DonorRegister/>}/>
<Route path='/register/hospital' element={<HospitalRegister/>}/>
<Route path='/login/user' element={<UserLogin/>}/>

</Routes>
</BrowserRouter>
    </div>
  )
}

export default App