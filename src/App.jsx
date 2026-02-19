import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/LoginForm'
import SignUp from '../pages/SignupForm'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
