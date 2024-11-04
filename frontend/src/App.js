// src/App.js
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

export const AuthContext = createContext();
export const UserContext = createContext();

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ authToken, setAuthToken }}>
        <UserContext.Provider value={{ userDetail, setUserDetail }}>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/" />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
