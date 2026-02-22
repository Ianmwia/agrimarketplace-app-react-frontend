import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import Login from '../pages/LoginForm'
import SignUp from '../pages/SignupForm'
import Navbar from '../components/Navbar'
import Layout from './components/layout'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import FarmerDashboard from '../dashboards/Farmer'

function App() {

  return (
    <BrowserRouter>
    <Toaster position='top-right'/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        {/*navbar routes */}
        <Route element={<Layout />}>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/farmer' element={<FarmerDashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
