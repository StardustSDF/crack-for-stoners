// src/index.ts
import { ovenSimulatorFactory } from './ovenSimulator'

const oven = ovenSimulatorFactory(1);

const newAttributes = {
    maxTemp: 300,
    minTemp: 30,
    maxRamp: 7,
    rampRamp: 0,
    contErr: 0,
    tickRate: 100,
    intTemp: 0,
    intRamp: 1,

};
oven.setOvenAttributes(newAttributes);
const state = oven.getState();

oven.setTarTemp(200);
console.log(`Target Temperature: ${oven.getTarTemp()}`);

// oven.setRamp(initial ramp rate, target ramp rate, ramp ramp rate)
oven.setRamp(7, 7, 0);
console.log(`Initial ramp rate: ${oven.getCurRamp()}`)
console.log(`Target ramp rate: ${oven.getTarRamp()}`)
console.log(`Ramp ramp rate: ${oven.getRampRamp()}`)

// oven.setModes(standard ramp mode, broken ramp mode, broken wobble mode)
oven.setModes(true, false, false);
if (state.s1 == true) {
    console.log(`Initialized oven with standard ramp mode`)
}
if (state.s2 == true) {
    console.log(`Initialized oven with broken wobble mode`)
}
if (state.s4 == true) {
    console.log(`Initialized oven with broken ramp mode`)
}


