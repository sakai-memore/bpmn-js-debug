// give values from params
export function Car(engine) {
  this.begin = function() {
    engine.start();
  };
  // this.engine
  this.maker = engine.maker
}

export function createEngine(power, maker) {
  return {
    maker: maker,
    start: () => {
      console.log(`Starting engine with ${power} hp of petrol made by ${maker}`);
    }
  };
}
