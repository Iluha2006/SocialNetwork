import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './components/App';
import { store, persistor } from './configStore/configureStore';
import './echo';
import '../css/app.css';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<div className="flex items-center justify-center min-h-screen text-gray-400">Загрузка...</div>}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);