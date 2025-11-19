export { setTokenRefreshListener } from './api';
import * as Auth from './auth';
import * as MasterRack from './master-rack';
import * as MasterWarehouse from './master-warehouse';
import * as MasterCMT from './master-cmt';
import * as MasterInventory from './master-inventory';
import * as MasterProduct from './master-product';

const Services = {
    Auth,
    MasterRack,
    MasterWarehouse,
    MasterCMT,
    MasterInventory,
    MasterProduct
};

export default Services;