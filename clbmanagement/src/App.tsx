import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateAdmin from './pages/CreateAdmin';
import Dashboard from './pages/Home';
import { ClubForm } from './components/ClubForm';
import DashboardLayout from './layouts/DashboardLayout';
import Clubs from './pages/Clubs';
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import ClubAdminDashboard from './pages/ClubAdminDashboard';
import LoginAdminCLB from './pages/LoginAdminCLB';
import Home from './pages/Home';
import Events from './pages/student/Events';
import MyClubs from './pages/student/MyClubs';
import Notifications from './pages/student/Notifications';
import Settings from './pages/student/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/my-clubs" element={<MyClubs />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dashboard-admin" element={<AdminDashboard />} />
                <Route path="clubs" element={<Clubs />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="createAdmin" element={<CreateAdmin />} />
                <Route path="login-teacher" element={<LoginAdmin />} />
                <Route path="/dashboard-teacher-clb" element={<ClubAdminDashboard />} />
                <Route path="login-admin" element={<LoginAdminCLB />} />
                <Route path="home" element={<Home />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
