import { ovenSimulatorFactory } from "../ovenSimulator";
import { sleep } from "../ovenSimulator";

let oven: ReturnType<typeof ovenSimulatorFactory>;

beforeEach(() => {
  oven = ovenSimulatorFactory(1);
});

afterEach(() => {
  clearInterval(oven.intervalHandler);
});

test("Working Oven FULL TEST", async () => {
const newAttributes = {
    maxTemp: 300,
    minTemp: 30,
    maxRamp: 10,
    rampRamp: 0,
    contErr: 2,
    tickRate: 100,
    intTemp: 0,
    intRamp: 7,

};
oven.setOvenAttributes(newAttributes);
const state = oven.getState();

oven.setTarTemp(50);
console.log(`Target Temperature: ${oven.getTarTemp()}`);

// oven.setRamp(initial ramp rate, target ramp rate, ramp ramp rate)
oven.setRamp(7, 7, 1);
console.log(`Initial ramp rate: ${oven.getCurRamp()}`)
console.log(`Target ramp rate: ${oven.getTarRamp()}`)
console.log(`Ramp ramp rate: ${oven.getRampRamp()}`)

// oven.setModes(standard ramp mode, broken ramp mode, broken wobble mode)
oven.setModes(true, false, false);
if (state.s1 == true) {
    console.log(`Initialized oven with standard ramp mode`)
};
if (state.s2 == true) {
    console.log(`Initialized oven with broken wobble mode`)
};
if (state.s4 == true) {
    console.log(`Initialized oven with broken ramp mode`)
};

await sleep(100)
expect(oven.getOvenId()).toBe(1);
//expect(oven.getTarTemp()).toBe(100);
expect(oven.getCurTemp()).toBe(14);
expect(oven.getCurRamp()).toBe(7);
expect(oven.getTarRamp()).toBe(7);
expect(oven.getRampRamp()).toBe(1);
expect(oven.gets1()).toBe(true);
expect(oven.gets2()).toBe(false);
expect(oven.gets3()).toBe(false);
expect(oven.gets4()).toBe(false);
expect(oven.getTime()).toBe(1);
expect(oven.getMaxTemp()).toBe(300);
expect(oven.getMinTemp()).toBe(30);
expect(oven.getMaxRamp()).toBe(10);
expect(oven.getTickRate()).toBe(100);
expect(oven.getContErr()).toBe(2);
expect(oven.getIntTemp()).toBe(0);
expect(oven.getIntRamp()).toBe(7);

await sleep(100)
expect(oven.getOvenId()).toBe(1);
//expect(oven.getTarTemp()).toBe(100);
expect(oven.getCurTemp()).toBe(21);
expect(oven.getCurRamp()).toBe(7);
expect(oven.getTarRamp()).toBe(7);
expect(oven.getRampRamp()).toBe(1);
expect(oven.gets1()).toBe(true);
expect(oven.gets2()).toBe(false);
expect(oven.gets3()).toBe(false);
expect(oven.gets4()).toBe(false);
expect(oven.getTime()).toBe(2);
expect(oven.getMaxTemp()).toBe(300);
expect(oven.getMinTemp()).toBe(30);
expect(oven.getMaxRamp()).toBe(10);
expect(oven.getTickRate()).toBe(100);
expect(oven.getContErr()).toBe(2);
expect(oven.getIntTemp()).toBe(0);
expect(oven.getIntRamp()).toBe(7);

await sleep(1010)
expect(oven.getOvenId()).toBe(1);
//expect(oven.getTarTemp()).toBe(100);
expect(oven.getCurTemp()).toBeGreaterThan(21);
expect(oven.getCurRamp()).toBe(7);
expect(oven.getTarRamp()).toBe(7);
expect(oven.getRampRamp()).toBe(1);
expect(oven.gets1()).toBe(false);
expect(oven.gets2()).toBe(false);
expect(oven.gets3()).toBe(true);
expect(oven.gets4()).toBe(false);
expect(oven.getTime()).toBe(12);
expect(oven.getMaxTemp()).toBe(300);
expect(oven.getMinTemp()).toBe(30);
expect(oven.getMaxRamp()).toBe(10);
expect(oven.getTickRate()).toBe(100);
expect(oven.getContErr()).toBe(2);
expect(oven.getIntTemp()).toBe(0);
expect(oven.getIntRamp()).toBe(7);

});

