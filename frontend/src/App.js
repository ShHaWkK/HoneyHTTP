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
import { useEffect } from "react";
import { startTracking } from "../tracker";

useEffect(() => {
  startTracking();
}, []);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/users" element={<Users />} />
          <Route path="/admin-create" element={<CreateAdmin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/xss" element={<XSSForm />} />
          <Route path="/php-editor" element={<FakePHP />} />
          <Route path="/wordpress" element={<WordPress />} />
          <Route path="/explorer" element={<FileExplorer />} />
          <Route path="/exfiltration" element={<Exfiltration />} />
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/upload-profile" element={<ProfileUpload />} />
          <Route path="/admin-dump" element={<AdminDump />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
