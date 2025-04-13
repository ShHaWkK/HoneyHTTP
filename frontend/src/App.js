import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

// Dashboard principal
import Dashboard from "./pages/Dashboard";

// Monitoring
import Logs from "./pages/Monitoring/Logs";
import Analytics from "./pages/Monitoring/Analytics";

// Security
import MFA from "./pages/Security/MFA";
import AccessLogs from "./pages/Security/AccessLogs";
import AccessToken from "./pages/Security/AccessToken";

// Settings
import PhpConfig from "./pages/Settings/PhpConfig";
//import NetworkConfig from "./pages/Settings/NetworkConfig";

// Storage
import CloudBuckets from "./pages/Storage/CloudBuckets";

// System
import Files from "./pages/System/Files";

// Users
import Users from "./pages/Users/Users";
import Profile from "./pages/Users/Profile";

// Auth
import SSO from "./pages/Auth/SSO";

// Pages diverses
import AdminDump from "./pages/AdminDump";
import AdminPanel from "./pages/AdminPanel";
import Chat from "./pages/Chat";
import CreateAdmin from "./pages/CreateAdmin";
import Database from "./pages/System/Database";
import Exfiltration from "./pages/Security/Exfiltration";
import SpyAdmin from "./pages/SpyAdmin";
import Upload from "./pages/Users/Upload";
import XSSForm from "./pages/XSSForm";
import WordPress from "./pages/System/WordPress";

import { startTracking } from "./pages/tracker";
import "./theme/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  useEffect(() => {
    startTracking();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques, sans sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Routes privées avec layout sécurisé */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Monitoring */}
          <Route path="/system/logs" element={<Logs />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Security */}
          <Route path="/security/mfa" element={<MFA />} />
          <Route path="/security/access-logs" element={<AccessLogs />} />
          <Route path="/security/access-token" element={<AccessToken />} />

          {/* Settings */}
          <Route path="/settings/php-config" element={<PhpConfig />} />

          {/* Storage */}
          <Route path="/storage/buckets" element={<CloudBuckets />} />

          {/* System */}
          <Route path="/system/files" element={<Files />} />

          {/* Users */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/profile" element={<Profile />} />

          {/* Auth (phishing page) */}
          <Route path="/auth/sso" element={<SSO />} />

          {/* Divers et honeypot */}
          <Route path="/admin-dump" element={<AdminDump />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin-create" element={<CreateAdmin />} />
          <Route path="/database" element={<Database />} />
          <Route path="/exfiltration" element={<Exfiltration />} />
          <Route path="/spy" element={<SpyAdmin />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/xss" element={<XSSForm />} />
          <Route path="/wordpress" element={<WordPress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
