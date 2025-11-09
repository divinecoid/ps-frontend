import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/login';
import "../globals.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
