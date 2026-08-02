import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import App from './components/App';
import { store } from './configStore/configureStore';
import './echo';

const STORAGE_HOSTS = [
    'http://storage:9000',
    'https://storage:9000',
    'http://localhost:9000',
    'https://localhost:9000',
    'storage:9000',
];

function normalizeUrl(url) {
    if (typeof url !== 'string') return url;
    for (const host of STORAGE_HOSTS) {
        if (url.startsWith(host)) {
            return url.slice(host.length) || '/social-media/';
        }
    }
    return url;
}

function normalizeUrls(obj) {
    if (typeof obj === 'string') return normalizeUrl(obj);
    if (Array.isArray(obj)) return obj.map(normalizeUrls);
    if (obj && typeof obj === 'object') {
        const result = {};
        for (const key of Object.keys(obj)) {
            result[key] = normalizeUrls(obj[key]);
        }
        return result;
    }
    return obj;
}

axios.interceptors.response.use(
    (response) => {
        if (response.data) {
            response.data = normalizeUrls(response.data);
        }
        return response;
    },
    (error) => Promise.reject(error)
);

Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('user_avatar_')) {
        const val = localStorage.getItem(key);
        if (val && (val.includes('storage:9000') || val.includes('localhost:9000'))) {
            localStorage.removeItem(key);
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);