// src/ovenSimulator.ts
import { promisify } from "util";

export const sleep = promisify(setTimeout);

// the oven attributes must look like this
interface ovenAttributes {
    maxTemp: number;
    minTemp: number;
    maxRamp: number;
    rampRamp: number;
    contErr: number;
    tickRate: number;
    intTemp: number;
    intRamp: number;
}

// just how the paramaters of the oven variables should look
interface simulatedOvenState {
    curTemp: number;
    tarTemp: number;
    curRamp: number;
    curRampTar: number;
    cycles: number;
    // s1 is true if ramping conditions are normal
    s1: boolean;
    // s2 is true if "broken mode" is enabled (as if that's something that I need to go out of my way for)
    s2: boolean;
    // s3 is true when the oven reaches its target temperature
    s3: boolean;
    // s4 is true
    s4: boolean;
    attributes: ovenAttributes;
}

// the actual factory
export const ovenSimulatorFactory = (id: number) => {
    const ovenState: simulatedOvenState = {
        curTemp: 0,
        tarTemp: 0,
        curRamp: -1,
        curRampTar: -1,
        cycles: -1,
        s1: false,
        s2: false,
        s3: false,
        s4: false,
        attributes: {
            maxTemp: 300,
            minTemp: 30,
            maxRamp: 7,
            rampRamp: 0,
            contErr: 1,
            tickRate: 100,
            intTemp: 0,
            intRamp: 0,
        },
    };

// the evaluationLoop is the brains of the oven, it determines based on every scenario what happens next
    const evaluationLoop = () => {
        let j = ovenState.cycles
        j = j + 1
        ovenState.cycles = j
        let cR = ovenState.curRamp
        const josh = idiotproofer()
        if (josh == false) {
            throw new Error("Improper values assigned, execution halted")
        }
        //console.log(`Current Temperature: ${ovenState.curTemp}`)
        //console.log(`Target Temperature: ${ovenState.tarTemp}`)
        //console.log(`Current Ramp: ${ovenState.curRamp}`)
        //console.log(`Ramp Target: ${ovenState.curRampTar}`)
        //console.log(`Time Elapsed: ${ovenState.cycles}`)
        let s1 = ovenState.s1
        //let s2 = ovenState.s2
        let s3 = ovenState.s3
        if (s1 == true) {
            rampMode()
        }
        //else if (s2 == true) {
            //brokenWobbleMode()
        //}
        else if (s3 == true) {
            wobbleMode()
        }        
        ovenState.curRamp = rampRampFormula(cR);
    };
    

    // s1
    const rampMode = () => {
        let cT = ovenState.curTemp;
        let tT = ovenState.tarTemp;
        let cR = ovenState.curRamp;
      //let tR = ovenState.curRampTar;
      //let cE = ovenState.attributes.contErr;
        let s4 = ovenState.s4
        if (s4 == true) {
            brokenRampMode()
        }
        else {
            if (tT - cR >= cT) {
                ovenState.curTemp = cT + cR
            }
            else {
                ovenState.curTemp = tT
                ovenState.s1 = false
                ovenState.s3 = true
            }
        }
    };

    // s4
    const brokenRampMode = () => {
        let cT = ovenState.curTemp;
        let tT = ovenState.tarTemp;
        let cR = ovenState.attributes.intRamp;
      //let tR = ovenState.curRampTar;
      //let cE = ovenState.attributes.contErr;
        let nR = rampRampFormula(cR);
        if (tT - nR >= cT) {
            ovenState.curTemp = cT + nR
        }
        else {
            ovenState.curTemp = tT
            ovenState.s1 = false
            ovenState.s3 = true
        }
    }

    //formula for increasing the ramp rate
    const rampRampFormula = (current: number) => {
        let r = ovenState.attributes.rampRamp
        let newNumber = r + current
        let j = ovenState.curRampTar
        if (newNumber > j) {
          newNumber = j
        }
        return newNumber
    }
    
    // s3
    const wobbleMode = () => {
        let s2 = ovenState.s2
        let tT = ovenState.tarTemp
        let cT = ovenState.curTemp
        let arror = ovenState.attributes.contErr
        let max = tT + arror
        let min = tT - arror
        if (s2 == true) {
            brokenWobbleMode()
        }
        else {
            let maxDraw = max - cT
            let j = 0 - cT
            let minDraw = j + min
            ovenState.curTemp = cT + getRandomFloat(minDraw, maxDraw)
        }
    };
    // This is for s3 only
    const getRandomFloat = (minc: number, maxc: number): number => {
        return Math.random() * (maxc - minc) + minc;
    };
    
    // s2
    const brokenWobbleMode = () => {
        let cT = ovenState.curTemp;
        let tT = ovenState.tarTemp;
      //let cR = ovenState.curRamp;
      //let tR = ovenState.curRampTar;
        let cE = ovenState.attributes.contErr + 5
        let max = tT + cE
        let min = tT - cE
        let maxDraw = max - cT
        let j = 0 - cT
        let minDraw = j + min
        ovenState.curTemp = cT + getRandomFloat(minDraw, maxDraw)
    };
    // just checks if the user is an idiot and didn't realize that they inputted something that contradicts themselves or the code
    const idiotproofer = () => {
        if (ovenState.tarTemp > ovenState.attributes.maxTemp) {
            return false
        }
        if (ovenState.tarTemp < ovenState.attributes.minTemp) {
            return false
        }
        if (ovenState.curRampTar > ovenState.attributes.maxRamp) {
            return false
        }
        if (ovenState.curRampTar < 0) {
            return false
        }
        if (ovenState.attributes.rampRamp < 0) {
            return false
        }
        if (ovenState.attributes.rampRamp > ovenState.attributes.intRamp) {
            return false
        }
        if (ovenState.attributes.tickRate < 0) {
            return false
        }
        if (ovenState.attributes.contErr < 0) {
            return false
        }
        if (ovenState.s1 == true) {
            if (ovenState.s4 == true) {
                return false
            }
        }
        if (ovenState.s2 == true) {
            if (ovenState.s3 == true) {
                return false
            }
        }
    }















    // tick rate is set to 100 and oughtn't to change
    const intervalHandler = setInterval(evaluationLoop, ovenState.attributes.tickRate);

// everything down here assigns values to variables, as well as allowing you to access the value of those variables.
    return {
        getOvenId: () => id,
        getState: (): simulatedOvenState => ovenState,
        getTarTemp: () => ovenState.tarTemp,
        getCurTemp: () => ovenState.curTemp,
        getCurRamp: () => ovenState.curRamp,
        getTarRamp: () => ovenState.curRampTar,
        gets1: () => ovenState.s1,
        gets2: () => ovenState.s2,
        gets3: () => ovenState.s3,
        getTime: () => ovenState.cycles,
        getMaxTemp: () => ovenState.attributes.maxTemp,
        getMinTemp: () => ovenState.attributes.minTemp,
        getMaxRamp: () => ovenState.attributes.maxRamp,
        getRampRamp: () => ovenState.attributes.rampRamp,
        getContErr: () => ovenState.attributes.contErr,
        getTickRate: () => ovenState.attributes.tickRate,
        getIntTemp: () => ovenState.attributes.intTemp,
        getIntRamp: () => ovenState.attributes.intRamp,
        gets4: () => ovenState.s4,
        setOvenAttributes: (attributes: ovenAttributes) => {
            ovenState.attributes = attributes;
            ovenState.cycles = -1;
        },
        
        setTarTemp: (setpoint: number) => {
            ovenState.tarTemp = setpoint;
        },

        setRamp: (startRamping: number, endRamping: number, rampRamping: number) => {
            ovenState.curRamp = startRamping;
            ovenState.attributes.intRamp = startRamping;
            ovenState.attributes.rampRamp = rampRamping
            ovenState.curRampTar = endRamping;
        },

        setModes: (standardRamp: boolean, brokenRamp: boolean, brokenWobble: boolean) => {
            ovenState.s1 = standardRamp;
            ovenState.s4 = brokenRamp;
            ovenState.s2 = brokenWobble;
            evaluationLoop()
        },
        

        intervalHandler,
    };
};

