import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import Login from '../Pages/Login';
import Bilan from '../Pages/Bilan';
import AdminUsers from '../Pages/AdminUsers';
import AdminBDD from '../Pages/AdminBDD';
import CompareEmission from '../Pages/CompareEmission';
import CompareRegion from '../Pages/CompareRegion';
import UserProfile from '../Pages/UserProfile';
import Register from '../Pages/Register';
import NotFound from '../Pages/NotFound';
import CompareBilan from '../Pages/CompareBilan';
import Historique from '../Pages/Historique';
import HabitudeTransport from '../Pages/HabitudeTransport';
import HabitudeNumerique from '../Pages/HabitudeNumerique';
import HabitudeAlimentation from '../Pages/HabitudeAlimentation';
import MentionsLegales from './MentionsLegales';

import { UserProvider } from './context/UserContext';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/bilan" element={<Bilan />} />
                    <Route path="/habitudeTransport" element={<HabitudeTransport />} />
                    <Route path="/habitudeNumerique" element={<HabitudeNumerique />} />
                    <Route path="/habitudeAlimentation" element={<HabitudeAlimentation />} />
                    <Route path="/mentionsLegales" element={<MentionsLegales />} />
                    <Route path="/adminusers" element={<AdminUsers />} />
                    <Route path="/adminbdd" element={<AdminBDD />} />
                    <Route path="/historique" element={<Historique />} />
                    <Route path="/compareEmission" element={<CompareEmission />} />
                    <Route path="/compareRegion" element={<CompareRegion />} />
                    <Route path="/compareBilan" element={<CompareBilan />} />
                    <Route path="/userProfile" element={<UserProfile />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;