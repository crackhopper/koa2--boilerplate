import mongoose, { FilterQuery, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';
import settingSchema from './setting'
import config from '../config';
import _ from 'lodash'
import Debug from 'debug'
const debug = Debug('app:model')

mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', function(err){
  debug('mongodb err',err)
});
db.once('open', function() {
  // we're connected!
  debug('db connected')
});

let SettingModel = mongoose.model('Setting', new mongoose.Schema(settingSchema))

function _custom_assign(objValue:any, srcValue:any){
  return (srcValue!==undefined 
    && srcValue!==null 
    && !(srcValue instanceof Function))? srcValue: objValue
}
export function NotNullUndefinedAssign(dst: any, src: any){
  _.assignInWith(dst, src, _custom_assign)
}

class Setting{
  setting_model :InstanceType<typeof SettingModel>

  version?: number
  config?: Object

  constructor(fields?:Partial<Setting>){
    this.setting_model = new SettingModel(fields)
    NotNullUndefinedAssign(this, fields)
  }

  static deleteMany(){
    return SettingModel.deleteMany()
  }
  static find(filter?: FilterQuery<unknown>) {
    if(filter===undefined){
      return SettingModel.find()
    }else{
      return SettingModel.find(filter)
    }
  }
  static findOne(filter?: FilterQuery<unknown>, projection?:any, options?: QueryOptions) {
    return SettingModel.findOne(filter, projection, options)
  }
  save(options?: SaveOptions){
    NotNullUndefinedAssign(this.setting_model, this)
    return this.setting_model.save(options)
  }
  update(update?: UpdateQuery<unknown>, options?: QueryOptions){
    NotNullUndefinedAssign(this.setting_model, this)
    return this.setting_model.updateOne(update, options)
  }
  delete(options?: QueryOptions){
    return this.setting_model.deleteOne(options)
  }
}
export {Setting}
