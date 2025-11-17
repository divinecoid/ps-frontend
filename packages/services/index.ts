export { setTokenRefreshListener } from './api';
import * as Auth from './auth';
import * as MasterRack from './master-rack';
import * as MasterWarehouse from './master-warehouse';

const Services = { Auth, MasterRack, MasterWarehouse };

export default Services;