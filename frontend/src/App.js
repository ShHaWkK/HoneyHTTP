import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Users from "./pages/Users";
import CreateAdmin from "./pages/CreateAdmin";
import AdminPanel from "./pages/AdminPanel";
import XSSForm from "./pages/XSSForm";
import FakePHP from "./pages/FakePHP";
import WordPress from "./pages/WordPress";
import FileExplorer from "./pages/FileExplorer";
import Exfiltration from "./pages/Exfiltration";
import LogViewer from "./pages/LogViewer";
import Chat from "./pages/Chat";
import ProfileUpload from "./pages/ProfileUpload";
import AdminDump from "./pages/AdminDump";
import SpyAdmin from "./pages/SpyAdmin";
import Dashboard from "./pages/Dashboard";
import PhishPage from "./pages/PhishPage";
import TokenViewer from "./pages/TokenViewer";

import Config from "./pages/Config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/styles.css";

import { startTracking } from "./pages/tracker";

import { useEffect } from "react";

function App() {
  useEffect(() => {
    startTracking();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/users" element={<Users />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-create" element={<CreateAdmin />} />
          <Route path="/phish-page" element={<PhishPage />} />
          <Route path="/config" element={<Config />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/xss" element={<XSSForm />} />
          <Route path="/editor" element={<FakePHP />} />
          <Route path="/wordpress" element={<WordPress />} />
          <Route path="/explorer" element={<FileExplorer />} />
          <Route path="/token" element={<TokenViewer />} />
          <Route path="/exfiltration" element={<Exfiltration />} />
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload-profile" element={<ProfileUpload />} />
          <Route path="/admin-dump" element={<AdminDump />} />
          <Route path="/spy" element={<SpyAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
