import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/login';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login/index" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
