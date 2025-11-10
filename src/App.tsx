import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import "../globals.css";
import Login from './auth/login';
import Register from './auth/register';
import Home from './main/home';

function App({ initialToken }) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={initialToken ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
