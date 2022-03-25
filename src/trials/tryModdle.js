import Factory from './lib/FactoryForModdle.js';

import descriptor  from './lib/carDescriptor.js';


const testModdel = () => {
  
  // new Factory
  const descriptors = [ descriptor ];
  const factory = new Factory(descriptors);
  
  // get the main car instance
  const carModel = factory.get_instance('car:Car', {
    id: '123',
    name: 'Calon',
    description: 'Toyota',
    power: '10000',
    similar: []
  });
  
  // create similar cars
  const carSimilar1 = factory.get_instance('car:Car', {
    name:'Mix',
    description: 'Honda',
    power: '11000'
  })
  const carSimilar2 = factory.get_instance('car:Car', {
    name:'Mono',
    description: 'Nissan',
    power: '9000'
  })
  
  // push similar cars
  carModel.get('similar').push(carSimilar1);
  carModel.get('similar').push(carSimilar2);
  
  // 
  console.log(carModel) // FIXME can not print out an array
  console.log(carModel.get('similar'))
}

// ------------------------------// entry point
const debug = () => {
  console.log('// ----------------// start debug!');
  // 
  testModdel();
  
  console.log('');
  console.log('// ----------------// end ........');

}

// -------------------------------------------// document.ready
debug();
