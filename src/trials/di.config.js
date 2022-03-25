import { Car, createEngine } from './CarModule.js';

export const carModuleConf = {
  'car': ['type', Car],                       // type 
  'engine': ['factory', createEngine],        // factory: create engine
  'power': ['value', 1210],                   // value
  'maker': ['value', 'Honda'],                // value
};
