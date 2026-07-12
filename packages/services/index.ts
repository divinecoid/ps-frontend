export { setTokenRefreshListener } from "./api";
import * as Auth from "./auth";
import * as MasterUser from "./master-user";
import * as MasterRole from "./master-role";
import * as MasterRack from "./master-rack";
import * as MasterWarehouse from "./master-warehouse";
import * as MasterCMT from "./master-cmt";
import * as MasterProduct from "./master-product";
import * as MasterProductModel from "./master-product-model";
import * as MasterSize from "./master-size";
import * as MasterColor from "./master-color";
import * as MasterConfiguration from "./master-configuration";
import * as MasterFactory from "./master-factory";
import * as MasterSmallInventory from './master-inventory-small';
import * as MasterLargeInventory from "./master-inventory-large";
import * as MasterOnlineStore from "./master-online-store";
import * as MasterMarketplace from "./master-marketplace";
import * as MasterFabric from './master-fabric';
import * as MasterRollSize from './master-roll-size';
import * as TransactionRequest from "./transaction-request";
import * as TransactionInbound from "./transaction-inbound";
import * as TransactionMutation from "./transaction-mutation";
import * as TransactionOrder from "./transaction-order";
import * as TransactionFabricPurchase from "./transaction-fabric-purchase";
import * as TransactionFabricCutting from "./transaction-fabric-cutting";
import * as TransactionShopeeOrder from "./transaction-shopee-order";
import * as TransactionTiktokOrder from "./transaction-tiktok-order";
import * as TransactionManualOutbound from "./transaction-manual-outbound";
import * as Dashboard from "./dashboard";
import * as Acm from "./acm";
import * as AuditLog from "./audit-log";

const Services = {
  Auth,
  MasterUser,
  MasterRole,
  MasterRack,
  MasterWarehouse,
  MasterCMT,
  MasterProduct,
  MasterProductModel,
  MasterSize,
  MasterColor,
  MasterConfiguration,
  MasterFactory,
  MasterOnlineStore,
  MasterMarketplace,
  TransactionRequest,
  TransactionInbound,
  TransactionMutation,
  TransactionOrder,
  TransactionFabricPurchase,
  TransactionFabricCutting,
  TransactionShopeeOrder,
  TransactionTiktokOrder,
  TransactionManualOutbound,
  MasterSmallInventory,
  MasterLargeInventory,
  MasterFabric,
  MasterRollSize,
  Dashboard,
  Acm,
  AuditLog
};

export default Services;
