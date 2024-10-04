import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'

const Auth = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Auth;