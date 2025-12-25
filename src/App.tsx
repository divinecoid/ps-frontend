import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmptyPage } from '@/components/custom/empty-page';
import { useAuth } from '@/provider/auth-provider';
import "../globals.css";
import Login from './auth/login';
import Register from './auth/register';
import NavigationLayout from '@/components/custom/navigation-layout';
import Home from './main/home';
import Example from './main/example';
import MasterUsers from './main/master-data/user';
import MasterRoles from './main/master-data/role';
import MasterRacks from './main/master-data/rack';
import MasterWarehouse from './main/master-data/warehouse';
import MasterCMTs from './main/master-data/cmt';
import MasterInventories from './main/master-data/inventory';
import MasterProducts from './main/master-data/product';
import MasterProductModels from './main/master-data/product-model';
import MasterSizes from './main/master-data/size';
import MasterColors from './main/master-data/color';
import MasterFactories from './main/master-data/factory';
import MasterOnlineStores from './main/master-data/online-store';
import MasterMarketplaces from './main/master-data/marketplace';
import { hasRole } from '@/lib/jwt-decode';
import FormInventory from './main/master-data/inventory/form';
import FormExample from './main/example/form';
import WidgetPreviewPage from './main/example/widget-preview';

function App() {
  const { token } = useAuth();
  const isAdmin = token ? hasRole(token, "admin") : false;
  const isPreparist = token ? hasRole(token, "preparist") : false;
  const isChecker = token ? hasRole(token, "checker") : false;
  const dummiesEnabled = true;
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={token ? <NavigationLayout /> : <Navigate to="/login" replace />}>
          <Route path="/home" element={<Home />} />
        {dummiesEnabled && (
          <>
            <Route path="/example" element={<Example />} />
            <Route path="/example/new" element={<FormExample />} />
            <Route path="/example/edit/:id" element={<FormExample />} />
            <Route path="/example/preview" element={<WidgetPreviewPage/>} />
          </>
        )}
          {isAdmin && (
            <>
              <Route path="/master-data/user" element={<MasterUsers />} />
              <Route path="/master-data/role" element={<MasterRoles />} />
              <Route path="/master-data/rack" element={<MasterRacks />} />
              <Route path="/master-data/warehouse" element={<MasterWarehouse />} />
              <Route path="/master-data/cmt" element={<MasterCMTs />} />
              <Route path="/master-data/inventory" element={<MasterInventories />} />
              <Route path="/master-data/inventory/edit/:id" element={<FormInventory />} />
              <Route path="/master-data/product" element={<MasterProducts />} />
              <Route path="/master-data/product-model" element={<MasterProductModels />} />
              <Route path="/master-data/size" element={<MasterSizes />} />
              <Route path="/master-data/color" element={<MasterColors />} />
              <Route path="/master-data/factory" element={<MasterFactories />} />
              <Route path="/master-data/online-store" element={<MasterOnlineStores />} />
              <Route path="/master-data/marketplace" element={<MasterMarketplaces />} />
            </>
          )}

          {(isChecker || isPreparist) && (
            <>
              <Route path="/transaction/request" element={<></>} />
              <Route path="/transaction/order" element={<></>} />

            </>
          )}




          <Route path="*" element={<EmptyPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
