import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';



import { store } from '../configStore/configureStore';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import { AppRoutes } from '../routes';

function App() {
    return (
        <Provider store={store}>

                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<AppRoutes />} />
                    </Routes>
                </Router>

        </Provider>
    );
}

export default App;