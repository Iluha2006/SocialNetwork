import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../Pages/auth/Login';
import Register from '../Pages/auth/Register';
import { AppRoutes } from '../routes';
import { useWebSocketCalls } from '../hooks/Socket/Call/useWebSocketCalls';
import CallNotification from './Calls/CallNotification';
import OnlineUser from './OnlineSystem/OnlineUser';

function App() {
    useWebSocketCalls()

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