// src/index.ts


// THIS DOESN'T DO ANYTHING YET
// PLEASE NAVIGATE TO /src/__tests__/ovenSimulator.test.ts AND RUN "npm test" exluding quotation marks to test the oven
import { ovenSimulatorFactory } from './ovenSimulator'

// Initialization and DOM handling
document.addEventListener("DOMContentLoaded", () => {
    const simulator = ovenSimulatorFactory(1);
    const Attributes = {
        maxTemperature: 300,
        minTemperature: 30,
        maxRamp: 7,
        rampRamp: 0,
        controlError: 3,
        tickRate: 1000,
        initialTemperature: 0,
        initialRamp: 1,
    };
    simulator.setOvenAttributes(Attributes)
    simulator.setTarTemp(150);
    simulator.setRamp(1, 7, 0.1);
    simulator.setModes(true, false, false);
    let tickRate = simulator.getTickRate();
    const updateDOM = () => {
        let curMode = "Hello"
        let c1 = simulator.getcase1();
        let c2 = simulator.getcase2();
        //let c3 = simulator.getcase3();
        //let c4 = simulator.getcase4();
        if (c1 == true) {
            curMode = "Normal Ramp"
        }
        if (c2 == true) {
            curMode = "Normal Wobble"
        }
        document.getElementById("curTempId")!.innerText = simulator.getCurTemp().toString();
        document.getElementById("tarTempId")!.innerText = simulator.getTarTemp().toString();
        document.getElementById("curRampId")!.innerText = simulator.getCurRamp().toString();
        document.getElementById("tarRampId")!.innerText = simulator.getTarRamp().toString();
        document.getElementById("cyclesId")!.innerText = simulator.getTime().toString();
        //document.getElementById("curRampRamp")!.innerText = curRampRamp.toString();
        //document.getElementById("initialRampRateId")!.innerText = simulator.getIntRamp().toString();
        document.getElementById("curModeId")!.innerText = curMode.toString();
        //<p>Current Mode: <span id="curModeId"></span></p>
        //<p>Current Ramp Ramp Rate: <span id="curRampRampId">Initializing</span></p>
        //<p>Current Attributes: maxTemp: 300, minTemp: 30, maxRamp: 7, rampRamp: 0.1, controlError: 0, tickRate: 100</p>
        //<p>Initial ramp rate: <span id="initialRampRateId">0</span></p>
    // Updating the DOM every tick
    };
    setInterval(updateDOM, tickRate)
});
