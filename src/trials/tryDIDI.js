import { get_instance } from './CarFactory.js';

let car = get_instance();

car.begin();
console.log(car.maker);
