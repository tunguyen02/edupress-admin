import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Main from './Main';

const Routers = () => {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('accessToken'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem('accessToken'));
    }, [token]);

    return token ? <Main /> : <Auth />;
}

export default Routers;
