import { Injector } from 'didi';
import { carModuleConf } from './di.config.js';

const injector = new Injector([
  carModuleConf
]);

// invoke module method with param car
let carInstance ;
injector.invoke((car) => {
  carInstance = car
});

export function get_instance() {
  return carInstance;
}
