import * as DevSetting from './dev';
import * as ProdSetting from './prod'

const settings = process.env.NODE_ENV == 'production' ?  ProdSetting.Settings : DevSetting.Settings; 

export default settings;