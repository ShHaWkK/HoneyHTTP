// frontend/src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PUBLIC
import HomePage       from "./pages/HomePage";
import Features       from "./pages/Features";
import Pricing        from "./pages/Pricing";
import Support        from "./pages/Support";
import Login          from "./pages/Login";

// ERROR
import PermissionError from "./pages/Error/PermissionError";

// PRIVATE (HONEYPOT)
import Layout         from "./components/Layout";
import Dashboard      from "./pages/Dashboard";
import Logs           from "./pages/Monitoring/Logs";
import Analytics      from "./pages/Monitoring/Analytics";
import MFA            from "./pages/Security/MFA";
import AccessLogs     from "./pages/Security/AccessLogs";
import PhpConfig      from "./pages/Settings/PhpConfig";
import Files          from "./pages/System/Files";
import Users          from "./pages/Users/Users";
import Profile        from "./pages/Users/Profile";
import Tickets        from "./pages/Support/Tickets";
import MyTickets      from "./pages/Support/MyTickets";

import "./theme/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  useEffect(() => { document.title = "SecurePanel™"; }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/"        element={<HomePage/>} />
        <Route path="/features"element={<Features/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/login"   element={<Login/>} />
        <Route path="/error/502" element={<PermissionError/>} />

        {/* PRIVATE */}
        <Route element={<Layout/>}>
          <Route path="/dashboard"            element={<Dashboard/>} />
          <Route path="/system/logs"          element={<Logs/>} />
          <Route path="/analytics"            element={<Analytics/>} />
          <Route path="/security/mfa"         element={<MFA/>} />
          <Route path="/security/access-logs" element={<AccessLogs/>} />
          <Route path="/settings/php-config"  element={<PhpConfig/>} />
          <Route path="/system/files"         element={<Files/>} />
          <Route path="/users"                element={<Users/>} />
          <Route path="/users/profile"        element={<Profile/>} />
          <Route path="/support/tickets"      element={<Tickets/>} />
          <Route path="/support/my-tickets" element={<MyTickets/>} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
