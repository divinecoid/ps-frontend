import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/login';
import "../globals.css";
import Register from './auth/register';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
