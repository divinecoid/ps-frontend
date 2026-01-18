export { setTokenRefreshListener } from './api';
import * as Auth from './auth';
import * as MasterUser from './master-user';
import * as MasterRole from './master-role';
import * as MasterRack from './master-rack';
import * as MasterWarehouse from './master-warehouse';
import * as MasterCMT from './master-cmt';
import * as MasterProduct from './master-product';
import * as MasterProductModel from './master-product-model';
import * as MasterSize from './master-size';
import * as MasterColor from './master-color';
import * as MasterFactory from './master-factory';
import * as MasterOnlineStore from './master-online-store';
import * as MasterMarketplace from './master-marketplace';
import * as TransactionRequest from './transaction-request';
import * as TransactionInbound from './transaction-inbound';

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
    MasterFactory,
    MasterOnlineStore,
    MasterMarketplace,
    TransactionRequest,
    TransactionInbound
};

export default Services;