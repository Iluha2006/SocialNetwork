import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../Pages/auth/Login';
import Register from '../Pages/auth/Register';
import { AppRoutes } from '../routes';
import CallNotification from './Calls/CallNotification';
import OnlineUser from './OnlineSystem/OnlineUser';

function App() {
    return (
        <Router>
            <OnlineUser />
            <CallNotification />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Register />} />
                <Route path="*" element={<AppRoutes />} />
            </Routes>
        </Router>
    );
}

export default App;