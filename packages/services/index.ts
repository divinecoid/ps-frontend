export { setTokenRefreshListener } from './api';
import * as Auth from './auth';
import * as MasterRack from './master-rack';
import * as MasterWarehouse from './master-warehouse';
import * as MasterCMT from './master-cmt';
import * as MasterInventory from './master-inventory';
import * as MasterProduct from './master-product';
import * as MasterProductModel from './master-product-model';
import * as MasterSize from './master-size';
import * as MasterColor from './master-color';
import * as MasterFactory from './master-factory';
import * as MasterOnlineStore from './master-online-store';

const Services = {
    Auth,
    MasterRack,
    MasterWarehouse,
    MasterCMT,
    MasterInventory,
    MasterProduct,
    MasterProductModel,
    MasterSize,
    MasterColor,
    MasterFactory,
    MasterOnlineStore
};

export default Services;