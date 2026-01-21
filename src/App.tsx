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
import MasterProducts from './main/master-data/product';
import MasterProductModels from './main/master-data/product-model';
import MasterSizes from './main/master-data/size';
import MasterColors from './main/master-data/color';
import MasterFactories from './main/master-data/factory';
import MasterOnlineStores from './main/master-data/online-store';
import MasterMarketplaces from './main/master-data/marketplace';
import { hasRole } from '@/lib/jwt-decode';
import FormExample from './main/example/form';
import WidgetPreviewPage from './main/example/widget-preview';
import Request from './main/transaction/request';
import FormRequest from './main/transaction/request/new/form-request';
import DocumentBarcodePreview from './main/transaction/request/barcode/preview';
import Print from './main/print';
import Receive from './main/transaction/receive';
import ReceiveLogs from './main/transaction/receive-logs';
import FormReceiveLogs from './main/transaction/receive-logs/view/form-receive-logs';

function App() {
  const { token } = useAuth();
  const isAdmin = token ? hasRole(token, "admin") : false;
  const isPreparist = token ? hasRole(token, "preparist") : false;
  const isChecker = token ? hasRole(token, "checker") : false;
  const dummiesEnabled = false;
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
              <Route path="/example/preview" element={<WidgetPreviewPage />} />
            </>
          )}
          {isAdmin && (
            <>
              <Route path="/master-data/user" element={<MasterUsers />} />
              <Route path="/master-data/role" element={<MasterRoles />} />
              <Route path="/master-data/rack" element={<MasterRacks />} />
              <Route path="/master-data/warehouse" element={<MasterWarehouse />} />
              <Route path="/master-data/cmt" element={<MasterCMTs />} />
              {/* <Route path="/master-data/product" element={<MasterProducts />} /> */}
              <Route path="/master-data/product-model" element={<MasterProductModels />} />
              <Route path="/master-data/size" element={<MasterSizes />} />
              <Route path="/master-data/color" element={<MasterColors />} />
              <Route path="/master-data/factory" element={<MasterFactories />} />
              <Route path="/master-data/online-store" element={<MasterOnlineStores />} />
              <Route path="/master-data/marketplace" element={<MasterMarketplaces />} />
            </>
          )}

          {(isAdmin || isChecker || isPreparist) && (
            <>
              <Route path="/transaction/request" element={<Request />} />
              <Route path="/transaction/request/new" element={<FormRequest />} />
              <Route path="/transaction/request/:id" element={<FormRequest disabled={true} />} />
              <Route path="/transaction/request/:id/barcode" element={<DocumentBarcodePreview />} />
              <Route path="/transaction/receive/" element={<Receive />} />
              <Route path="/transaction/receive-logs/" element={<ReceiveLogs />} />
              <Route path="/transaction/receive-logs/:id" element={<FormReceiveLogs />} />
              <Route path="/transaction/order" element={<></>} />
              <Route path="/inventory" element={<MasterProducts />} />
            </>
          )}


          <Route path="*" element={<EmptyPage />} />
        </Route>
        <Route path="/print" element={<Print />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
