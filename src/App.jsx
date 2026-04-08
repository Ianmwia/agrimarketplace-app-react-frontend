import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster} from './components/ui/sonner'
import Login from '../pages/LoginForm'
import SignUp from '../pages/SignupForm'
import Navbar from '../components/Navbar'
import Layout from './components/layout'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Marketplace from '../dashboards/BuyersMarketplace'
import FarmerDashboard from '../dashboards/FarmerDashboard'
import ViewReport from '../dashboards/fieldofficerspages/ViewReport'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './routes/ProtectedRoute'
import ForgotPassword from '../pages/ForgotPassword'
import PasswordResetConfirm from '../pages/PasswordResetConfirm'
import ChangePassword from '../pages/ChangePassword'

import Chat from '../chat/ChatBoard'
import CreatePickUpPoint from '../map/PickUpPage'
import UpdateProduce from '../dashboards/farmerspages/UpdateProduce'
import StripeCheckout from '../dashboards/StripeCheckout'

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
    <Toaster position='top-right'/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password/:uid/:token' element={<PasswordResetConfirm/>} />
        {/*navbar routes */}
        <Route element={<Layout />}>

            <Route index element={<Home/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/change-password' element={<ChangePassword/>}/>
            <Route path='/thread' element={<Chat/>}/>
            <Route path='/pickup/:orderId' element={<CreatePickUpPoint/>}/>
            <Route path='/stripe-checkout' element={<StripeCheckout/>}/>
        
        <Route path='/farmer' element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard/> 
          </ProtectedRoute> }/>
        <Route path='/produce/update/:id' element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <UpdateProduce/> 
          </ProtectedRoute> }/>

        <Route path='/market' element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <Marketplace/> 
          </ProtectedRoute> }/>

        <Route path='/field_officer' element={
          <ProtectedRoute allowedRoles={['field_officer']}>
            <ViewReport/> 
          </ProtectedRoute> }/>

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
