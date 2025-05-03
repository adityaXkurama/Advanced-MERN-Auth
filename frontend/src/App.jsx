import FloatingShape from "./components/FloatingShape"

import { Routes,Route, Navigate } from "react-router-dom"
import SignUp from "./pages/SignUp"
import LoginPage from "./pages/LoginPage"
import Home from "./pages/Home"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import {Toaster} from 'react-hot-toast'
import { useAuthstore } from "./store/authStore"
import { useEffect } from "react"

const ProtectedRoute = ({children})=>{
  const {isAuthenticated,user,isLoading} = useAuthstore()
  
  if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}
  if (user && !user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	

  return children
}

const RedirectAuthenticatedUser =({children})=>{
  const {isAuthenticated,user}= useAuthstore()
  if(isAuthenticated && user.isVerified){
    return <Navigate to='/' replace />
  }
  return children
}


function App() {
  const {checkAuth,isCheckingAuth,isAuthenticated,user,isLoading} = useAuthstore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log("isAuthenticated",isAuthenticated);
  console.log("user",user);
  console.log("isLoading",isLoading);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />

      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />

      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      
      <Routes>

        <Route path="/" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
            <SignUp/>
          </RedirectAuthenticatedUser>
        }/>
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
            <LoginPage/>
          </RedirectAuthenticatedUser>
        }/>
        <Route path="/verify-email" element={<EmailVerificationPage/>}/>

      </Routes>
      <Toaster />
    </div>
  )
}

export default App
