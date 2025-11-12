import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import "../globals.css";
import Login from './auth/login';
import Register from './auth/register';
import NavigationLayout from '@/components/custom/navigation-layout';
import Home from './main/home';
import Example from './main/example';
import Master_Racks from './main/master-data/rack';
import Master_Warehouse from './main/master-data/warehouse';
import { EmptyPage } from '@/components/custom/empty-page';

function App({ initialToken }) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={initialToken ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<NavigationLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/example" element={<Example />} />
          <Route path="/master-data/rack" element={<Master_Racks />} />
          <Route path="/master-data/warehouse" element={<Master_Warehouse />} />





          <Route path="*" element={<EmptyPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
