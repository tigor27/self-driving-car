const carCanvas=document.getElementById ("carCanvas");
carCanvas.height=window.innerHeight;
carCanvas.width=200;

const networkCanvas=document.getElementById ("networkCanvas");
networkCanvas.height=window.innerHeight;
networkCanvas.width=400;

const carCtx = carCanvas.getContext ("2d");
const networkCtx = networkCanvas.getContext ("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width*0.9);
const N=100;
const cars = generateCars (N);
//const car = new Car (road.getLaneCenter(1), 100, 30, 50, "AI", 3);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];
animate();

function generateCars (N) {
    const cars=[];
    for (let i = 0; i <= N; i++) {
        cars.push (new Car(road.getLaneCenter(1), 100, 20,50,"AI"))
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    //car.update(road.borders, traffic);
    const bestCar = cars.find (c=>c.y==Math.min(...cars.map(c=>c.y)));
    carCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate (0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    carCtx.globalAlpha=0.2;
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "blue");
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
