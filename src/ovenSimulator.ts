// src/ovenSimulator.ts
import { promisify } from "util";

export const sleep = promisify(setTimeout);

// all oven attributes, for some reason it's pretty random what's an attribute and what isn't
export interface ovenAttributes {
    maxTemperature: number;
    minTemperature: number;
    maxRamp: number;
    rampRamp: number;
    controlError: number;
    tickRate: number;
    initialTemperature: number;
    initialRamp: number;
}
// these are the attributes that are too special to go in the other attribute section
export interface simulatedOvenState {
    currentTemperature: number;
    targetTemperature: number;
    currentRamp: number;
    targetRamp: number;
    timeElapsed: number;
    case1: boolean; // Normal Ramping Mode
    case2: boolean; // Normal Wobble Mode
    case3: boolean; // Broken Ramping Mode
    case4: boolean; // Broken Wobble Mode
    case4willbetrue: boolean;
    attributes: ovenAttributes;
}
// a factory, not a sweatshop
export const ovenSimulatorFactory = (id: number) => {
    const ovenState: simulatedOvenState = {
        currentTemperature: 0,
        targetTemperature: 0,
        currentRamp: -1,
        targetRamp: -1,
        timeElapsed: -1,
        case1: true,
        case2: false,
        case3: false,
        case4: false,
        case4willbetrue: false,
        attributes: {
            maxTemperature: 300,
            minTemperature: 30,
            maxRamp: 7,
            rampRamp: 0.1,
            controlError: 3,
            tickRate: 1000,
            initialTemperature: 0,
            initialRamp: 0,
        },
    };
    // runs every so milliseconds equal to tickRate
    const evaluationLoop = () => {
        const properVariableChecker = idiotproofer();
        if (properVariableChecker == false) {
            throw new Error("Improper values assigned, execution halted");
        }
        ovenState.timeElapsed++
        if (ovenState.case1 == true) {
            rampMode();
        }
        if (ovenState.case2 == true) {
            if (ovenState.case4willbetrue == false) {
                wobbleMode();}
            else {
                ovenState.case2 = false
                ovenState.case4 = true
                brokenWobbleMode
            }
        }
        if (ovenState.case3 == true) {
            brokenRampMode();
        }
        if (ovenState.case4 == true) {
            brokenWobbleMode();
        }
    };
    // case1, yo
    const rampMode = () => {
        let cT = ovenState.currentTemperature;
        let tT = ovenState.targetTemperature;
        let cR = ovenState.currentRamp;
        if (tT - cR >= cT) {
            ovenState.currentTemperature = cT + cR;
        } 
        else {
            ovenState.currentTemperature = tT;
            ovenState.case1 = false;
            ovenState.case2 = true;
        }  
        ovenState.currentRamp = rampRampFormula(cR);
    };
    // case3. it's broken because it uses the initial ramp rate for the formula each time instead of using the update ramp rate
    const brokenRampMode = () => {
        let cT = ovenState.currentTemperature;
        let tT = ovenState.targetTemperature;
        let cR = ovenState.attributes.initialRamp;
        let nR = cR
        if (tT - nR >= cT) {
            ovenState.currentTemperature = cT + nR;
        }
        else {
            ovenState.currentTemperature = tT;
            ovenState.case3 = false;
            ovenState.case2 = true;
        }
    };
    // old ramp + ramp ramp = new ramp
    const rampRampFormula = (current: number) => {
        let r = ovenState.attributes.rampRamp;
        r = r + 0.01
        if (r > 1) {
            r = 1
        }
        let newNumber = r + current;
        let j = ovenState.targetRamp;
        if (newNumber > j) {
            newNumber = j;
        }
        ovenState.attributes.rampRamp = r
        return newNumber;
    };
    // case2. Because the oven can't maintain exactly any temperature, it wobbles around the setpoint
    const wobbleMode = () => {
        let tT = ovenState.targetTemperature;
        let cT = ovenState.currentTemperature;
        let arror = ovenState.attributes.controlError;
        let max = tT + arror;
        let min = tT - arror;
        let maxDraw = max - cT;
            let j = 0 - cT;
            let minDraw = j + min;
            let nT = cT + getRandomFloat(minDraw, maxDraw);
        if (ovenState.case4 == true) {
            brokenWobbleMode();
        } 
        else {
            ovenState.currentTemperature = nT;
        }
    };
    // for case 2 and 4 only, gets a random number based on the uh the control error 
    const getRandomFloat = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    };
    // case4. It's broken because it can't maintain the setpoint temperature nearly as well as it's supposed to
    const brokenWobbleMode = () => {
        let tT = ovenState.targetTemperature;
        let cT = ovenState.currentTemperature;
        let arror = ovenState.attributes.controlError + 50
        let max = tT + arror;
        let min = tT - arror;
        let maxDraw = max - cT;
        let j = 0 - cT;
        let minDraw = j + min;
        let nT = cT + getRandomFloat(minDraw, maxDraw);
        ovenState.currentTemperature = nT;
    };
    // if a variable is WRONG, then this'll cause the code to stop
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
        if (ovenState.attributes.rampRamp < ovenState.attributes.initialRamp) {
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

    // interval handler for the evaluation loop
    const intervalHandler = setInterval(evaluationLoop, ovenState.attributes.tickRate);
    const clearIntervalHandler = () => clearInterval(intervalHandler);
    // returns variables and also lets you set variables
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
            ovenState.timeElapsed = 0;
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
            ovenState.case4willbetrue = brokenWobble;
            ovenState.case4 = false;
            ovenState.case2 = false;
        },
        clearInterval: () => {
            clearIntervalHandler();
        },
        intervalHandler,
    };
};

// Initialization and DOM handling
// For web interface
// Is not available here!
// A secret is required to unlock...
// Use "normal" testing instead