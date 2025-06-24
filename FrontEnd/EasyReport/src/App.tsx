
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import SignUp from './components/Auth/signin'; 
import UserLogin from './components/Auth/login';
import AdminLogin from './components/Auth/adminlogin';
import Home from './components/home';
import Dashboard from './components/dashboard';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/home" element={< Home/>} />
        <Route path="/" element={<UserLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard/>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
