import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { EmptyPage } from "@/components/custom/empty-page";
import { useAuth } from "@/provider/auth-provider";
import "../globals.css";
import Login from "./auth/login";
import Register from "./auth/register";
import NavigationLayout from "@/components/custom/navigation-layout";
import Home from "./main/home";
import Example from "./main/example";
import MasterUsers from "./main/master-data/user";
import MasterRoles from "./main/master-data/role";
import MasterRacks from "./main/master-data/rack";
import MasterWarehouse from "./main/master-data/warehouse";
import MasterCMTs from "./main/master-data/cmt";
import MasterProducts from "./main/master-data/product";
import MasterProductModels from "./main/master-data/product-model";
import MasterSizes from "./main/master-data/size";
import MasterColors from "./main/master-data/color";
import MasterFactories from "./main/master-data/factory";
import MasterOnlineStores from "./main/master-data/online-store";
import MasterMarketplaces from "./main/master-data/marketplace";
import { hasRole } from "@/lib/jwt-decode";
import FormExample from "./main/example/form";
import WidgetPreviewPage from "./main/example/widget-preview";
import Request from "./main/transaction/request";
import TrackCMT from "./main/transaction/track-cmt";
import FormRequest from "./main/transaction/request/new/form-request";
import DocumentBarcodePreview from "./main/transaction/request/barcode/preview";
import Print from "./main/print";
import Receive from "./main/transaction/receive";
import ReceiveLogs from "./main/transaction/receive-logs";
import ViewFormRequest from "./main/transaction/request/view/form-request";
import Order from "./main/transaction/order";
import FormOrder from "./main/transaction/order/view/form-order";
import Mutation from "./main/transaction/mutation";
import MasterLargeInventories from "./main/master-data/inventory-large";
import MasterSmallInventories from "./main/master-data/inventory-small";
import FormSmallInventory from "./main/master-data/inventory-small/form-inventory";
import FormLargeInventory from "./main/master-data/inventory-large/form-inventory";
import ViewFormReceiveLog from "./main/transaction/receive-logs/form-receive-logs";
import FabricPurchase from "./main/transaction/fabric-purchase";
import FormFabricPurchase from "./main/transaction/fabric-purchase/new/form-fabric-purchase";
import ViewFormFabricPurchase from "./main/transaction/fabric-purchase/view/form-fabric-purchase";
import MasterFabrics from "./main/master-data/fabric";
import MasterRollSizes from "./main/master-data/roll-size";
import MasterConfigurations from "./main/master-data/configuration";
import AcmPage from "./main/master-data/acm";
import MasterAuditLogs from "./main/master-data/audit-log";
import FabricCutting from "./main/transaction/fabric-cutting";
import FormFabricCuttingRequest from "./main/transaction/fabric-cutting/new/form-fabric-cutting-request";
import FabricReceiving from "./main/transaction/fabric-receiving";

function App() {
  const { token } = useAuth();
  const isAdmin = token ? hasRole(token, "admin") : false;
  const isPreparist = token ? hasRole(token, "preparist") : false;
  const isChecker = token ? hasRole(token, "checker") : false;
  const dummiesEnabled = false;
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            token ? <NavigationLayout /> : <Navigate to="/login" replace />
          }
        >
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
              <Route
                path="/master-data/warehouse"
                element={<MasterWarehouse />}
              />
              <Route path="/master-data/cmt" element={<MasterCMTs />} />
              <Route path="/master-data/product" element={<MasterProducts />} />
              <Route
                path="/master-data/product-model"
                element={<MasterProductModels />}
              />
              <Route path="/master-data/size" element={<MasterSizes />} />
              <Route
                path="/master-data/roll-size"
                element={<MasterRollSizes />}
              />
              <Route path="/master-data/color" element={<MasterColors />} />
              <Route
                path="/master-data/factory"
                element={<MasterFactories />}
              />
              <Route
                path="/master-data/online-store"
                element={<MasterOnlineStores />}
              />
              <Route
                path="/master-data/marketplace"
                element={<MasterMarketplaces />}
              />
              <Route
                path="/master-data/configuration"
                element={<MasterConfigurations />}
              />
              <Route path="/master-data/acm" element={<AcmPage />} />
              <Route
                path="/master-data/audit-log"
                element={<MasterAuditLogs />}
              />
            </>
          )}

          {(isAdmin || isChecker || isPreparist) && (
            <>
              <Route path="/transaction/request" element={<Request />} />
              <Route path="/transaction/track-cmt" element={<TrackCMT />} />
              <Route
                path="/transaction/request/new"
                element={<FormRequest />}
              />
              <Route
                path="/transaction/request/:id"
                element={<ViewFormRequest disabled={true} />}
              />
              <Route
                path="/transaction/request/:id/barcode"
                element={<DocumentBarcodePreview />}
              />
              <Route path="/transaction/receive/" element={<Receive />} />
              <Route
                path="/transaction/receive-logs/"
                element={<ReceiveLogs />}
              />
              <Route
                path="/transaction/receive-logs/:id"
                element={<ViewFormReceiveLog />}
              />
              <Route path="/transaction/mutation/" element={<Mutation />} />
              <Route path="/transaction/order" element={<Order />} />
              <Route path="/transaction/order/:id" element={<FormOrder />} />
              <Route
                path="/transaction/fabric-purchase"
                element={<FabricPurchase />}
              />
              <Route
                path="/transaction/fabric-purchase/new"
                element={<FormFabricPurchase />}
              />
              <Route
                path="/transaction/fabric-purchase/:id"
                element={<ViewFormFabricPurchase disabled={true} />}
              />
              <Route
                path="/small-inventory"
                element={<MasterSmallInventories />}
              />
              <Route
                path="/small-inventory/:id"
                element={<FormSmallInventory />}
              />
              <Route
                path="/large-inventory"
                element={<MasterLargeInventories />}
              />
              <Route
                path="/large-inventory/:id"
                element={<FormLargeInventory />}
              />
              <Route path="/fabric" element={<MasterFabrics />} />
              <Route
                path="/transaction/fabric-cutting"
                element={<FabricCutting />}
              />
              <Route
                path="/transaction/fabric-cutting/new"
                element={<FormFabricCuttingRequest />}
              />
              <Route
                path="/transaction/fabric-cutting/:id"
                element={<FormFabricCuttingRequest disabled />}
              />
              <Route
                path="/transaction/fabric-receiving"
                element={<FabricReceiving />}
              />
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
