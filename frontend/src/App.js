// 📁 frontend/src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FileExplorer from "./pages/FileExplorer";
import Config from "./pages/Config";
import FakePHP from "./pages/FakePHP";
import TokenViewer from "./pages/TokenViewer";
import PhishPage from "./pages/PhishPage";
import LogViewer from "./pages/LogViewer";
import Cloud from "./pages/Cloud";
import Users from "./pages/Users";
import CreateAdmin from "./pages/CreateAdmin";
import XSSForm from "./pages/XSSForm";
import Chat from "./pages/Chat";
import AdminDump from "./pages/AdminDump";
import ProfileUpload from "./pages/ProfileUpload";
import SpyAdmin from "./pages/SpyAdmin";
import WordPress from "./pages/WordPress";
import Upload from "./pages/Upload";

import "./theme/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { startTracking } from "./pages/tracker";

function App() {
  useEffect(() => {
    startTracking();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques, SANS sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Routes privées, avec Layout (sidebar + header) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/system/files" element={<FileExplorer />} />
          <Route path="/config" element={<Config />} />
          <Route path="/config-editor" element={<FakePHP />} />
          <Route path="/auth/token-preview" element={<TokenViewer />} />
          <Route path="/portal/secure-access" element={<PhishPage />} />
          <Route path="/system/logs" element={<LogViewer />} />
          <Route path="/cloud" element={<Cloud />} />
          <Route path="/users" element={<Users />} />
          <Route path="/admin-create" element={<CreateAdmin />} />
          <Route path="/xss" element={<XSSForm />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin-dump" element={<AdminDump />} />
          <Route path="/upload-profile" element={<ProfileUpload />} />
          <Route path="/spy" element={<SpyAdmin />} />
          <Route path="/wordpress" element={<WordPress />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
