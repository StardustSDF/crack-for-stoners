// src/ovenSimulator.ts
import { promisify } from "util";

export const sleep = promisify(setTimeout);

interface ovenAttributes {
    maxTemperature: number;
    minTemperature: number;
    maxRamp: number;
    rampRamp: number;
    controlError: number;
    tickRate: number;
    initialTemperature: number;
    initialRamp: number;
}

interface simulatedOvenState {
    currentTemperature: number;
    targetTemperature: number;
    currentRamp: number;
    targetRamp: number;
    timeElapsed: number;
    case1: boolean; // Normal Ramping Mode
    case2: boolean; // Normal Wobble Mode
    case3: boolean; // Broken Ramping Mode
    case4: boolean; // Broken Wobble Mode
    attributes: ovenAttributes;
}

const ovenSimulatorFactory = (id: number) => {
    const ovenState: simulatedOvenState = {
        currentTemperature: 0,
        targetTemperature: 0,
        currentRamp: -1,
        targetRamp: -1,
        timeElapsed: -1,
        case1: false,
        case2: false,
        case3: false,
        case4: false,
        attributes: {
            maxTemperature: 300,
            minTemperature: 30,
            maxRamp: 7,
            rampRamp: 0,
            controlError: 3,
            tickRate: 100,
            initialTemperature: 0,
            initialRamp: 0,
        },
    };

    const evaluationLoop = () => {
        ovenState.timeElapsed++
        let cR = ovenState.currentRamp;
        const properVariableChecker = idiotproofer();
        if (properVariableChecker == false) {
            throw new Error("Improper values assigned, execution halted");
        }
        if (ovenState.case1 == true) {
            rampMode();
        } else if (ovenState.case2 == true) {
            wobbleMode();
        }
        ovenState.currentRamp = rampRampFormula(cR);
    };

    const rampMode = () => {
        let cT = ovenState.currentTemperature;
        let tT = ovenState.targetTemperature;
        let cR = ovenState.currentRamp;
        if (ovenState.case3 == true) {
            brokenRampMode();
        } else {
            if (tT - cR >= cT) {
                ovenState.currentTemperature = cT + cR;
            } else {
                ovenState.currentTemperature = tT;
                ovenState.case1 = false;
                ovenState.case2 = true;
            }
        }
    };

    const brokenRampMode = () => {
        let cT = ovenState.currentTemperature;
        let tT = ovenState.targetTemperature;
        let cR = ovenState.attributes.initialRamp;
        let nR = rampRampFormula(cR);
        if (tT - nR >= cT) {
            ovenState.currentTemperature = cT + nR;
        } else {
            ovenState.currentTemperature = tT;
            ovenState.case3 = false;
            ovenState.case2 = true;
        }
    };

    const rampRampFormula = (current: number) => {
        let r = ovenState.attributes.rampRamp;
        let newNumber = r + current;
        let j = ovenState.targetRamp;
        if (newNumber > j) {
            newNumber = j;
        }
        return newNumber;
    };

    const wobbleMode = () => {
        let tT = ovenState.targetTemperature;
        let cT = ovenState.currentTemperature;
        let arror = ovenState.attributes.controlError;
        let max = tT + arror;
        let min = tT - arror;
        if (ovenState.case4 == true) {
            brokenWobbleMode();
        } else {
            let maxDraw = max - cT;
            let j = 0 - cT;
            let minDraw = j + min;
            ovenState.currentTemperature = cT + getRandomFloat(minDraw, maxDraw);
        }
    };

    const getRandomFloat = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    };

    const brokenWobbleMode = () => {
        let cT = ovenState.currentTemperature;
        let tT = ovenState.targetTemperature;
        let cE = ovenState.attributes.controlError + 5;
        let max = tT + cE;
        let min = tT - cE;
        let maxDraw = max - cT;
        let j = 0 - cT;
        let minDraw = j + min;
        ovenState.currentTemperature = cT + getRandomFloat(minDraw, maxDraw);
    };

    const idiotproofer = () => {
        if (ovenState.targetTemperature > ovenState.attributes.maxTemperature) {
            return false;
        }
        if (ovenState.targetTemperature < ovenState.attributes.minTemperature) {
            return false;
        }
        if (ovenState.targetRamp > ovenState.attributes.maxRamp) {
            return false;
        }
        if (ovenState.targetRamp < 0) {
            return false;
        }
        if (ovenState.attributes.rampRamp < 0) {
            return false;
        }
        if (ovenState.attributes.rampRamp > ovenState.attributes.initialRamp) {
            return false;
        }
        if (ovenState.attributes.tickRate < 0) {
            return false;
        }
        if (ovenState.attributes.controlError < 0) {
            return false;
        }
        if (ovenState.case1 == true) {
            if (ovenState.case3 == true) {
                return false;
            }
        }
        return true;
    };


    const intervalHandler = setInterval(evaluationLoop, ovenState.attributes.tickRate);
    const clearIntervalHandler = () => clearInterval(intervalHandler);

    return {
        getOvenId: () => id,
        getState: (): simulatedOvenState => ovenState,
        getTarTemp: () => ovenState.targetTemperature,
        getCurTemp: () => ovenState.currentTemperature,
        getCurRamp: () => ovenState.currentRamp,
        getTarRamp: () => ovenState.targetRamp,
        getcase1: () => ovenState.case1,
        getcase2: () => ovenState.case2,
        getcase3: () => ovenState.case3,
        getTime: () => ovenState.timeElapsed,
        getMaxTemp: () => ovenState.attributes.maxTemperature,
        getMinTemp: () => ovenState.attributes.minTemperature,
        getMaxRamp: () => ovenState.attributes.maxRamp,
        getRampRamp: () => ovenState.attributes.rampRamp,
        getContErr: () => ovenState.attributes.controlError,
        getTickRate: () => ovenState.attributes.tickRate,
        getIntTemp: () => ovenState.attributes.initialTemperature,
        getIntRamp: () => ovenState.attributes.initialRamp,
        getcase4: () => ovenState.case4,
        setOvenAttributes: (attributes: ovenAttributes) => {
            ovenState.attributes = attributes;
            ovenState.timeElapsed = -1;
        },
        setTarTemp: (setpoint: number) => {
            ovenState.targetTemperature = setpoint;
        },
        setRamp: (startRamping: number, endRamping: number, rampRamping: number) => {
            ovenState.currentRamp = startRamping;
            ovenState.attributes.initialRamp = startRamping;
            ovenState.attributes.rampRamp = rampRamping;
            ovenState.targetRamp = endRamping;
        },
        setModes: (standardRamp: boolean, brokenRamp: boolean, brokenWobble: boolean) => {
            ovenState.case1 = standardRamp;
            ovenState.case3 = brokenRamp;
            ovenState.case4 = brokenWobble;
            evaluationLoop();
        },
        clearInterval: () => {
            clearIntervalHandler();
        },
        intervalHandler,
    };
};

// Initialization and DOM handling
document.addEventListener("DOMContentLoaded", () => {
    const simulator = ovenSimulatorFactory(1);
    simulator.setTarTemp(250);
    simulator.setRamp(0.7, 7, 0.1);
    simulator.setModes(true, false, false);
    const updateDOM = () => {
        let curTemp = simulator.getCurTemp();
        let tarTemp = simulator.getTarTemp();
        let curRamp = simulator.getCurRamp();
        let tarRamp = simulator.getTarRamp();
        let cycles = simulator.getTime();
        let s1 = simulator.getcase1();
        let s2 = simulator.getcase2();
        let s3 = simulator.getcase3();
        let s4 = simulator.getcase4();
        let curRampRamp = simulator.getRampRamp();
        let initRamp = simulator.getIntRamp();
        let curMode = "Normal Ramp Up Mode"
        console.log({
            curTemp, tarTemp, curRamp, tarRamp, cycles, curRampRamp, initRamp, curMode
        });
        if (s1 == true) {
            curMode = "Normal Ramp Up Mode"
        };
        if (s2 == true) {
            curMode = "Normal Wobble Mode"
        };
        if (s3 == true) {
            curMode = "Broken Ramp Up Mode"
        };
        if (s4 == true) {
            curMode = "Broken Wobble Mode"
        };
        document.getElementById("curTempId")!.innerText = curTemp.toString();
        document.getElementById("tarTempId")!.innerText = tarTemp.toString();
        document.getElementById("curRampId")!.innerText = curRamp.toString();
        document.getElementById("tarRampId")!.innerText = tarRamp.toString();
        document.getElementById("cyclesId")!.innerText = cycles.toString();
        document.getElementById("curRampRamp")!.innerText = curRampRamp.toString();
        document.getElementById("initialRampRateId")!.innerText = initRamp.toString();
        document.getElementById("curModeId")!.innerText = curMode.toString();
    // Updating the DOM every tick
    setInterval(() => {
        updateDOM();
    }, simulator.getTickRate());
    };
});