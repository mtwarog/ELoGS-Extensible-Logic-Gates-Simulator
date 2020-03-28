const Const = require("./const").constants;

class State {
  constructor(machines) {
    this.state = {}
    for (let machineId in machines) {
      const outDim = machines[machineId].getOutputDimension();
      this.state[machineId] = new Array(outDim);
    }
  }
  getOutput(machine, port) {
    if (this.state[machine] === undefined) {
      throw new Error(Const.ErrorMessage.MACHINE_NOT_IN_STATE(machine));
    }
    if (port >= this.state[machine].length) {
      throw new Error(Const.ErrorMessage.PORT_OUT_OF_RANGE(true, machine, port, this.state[machine].length));
    }
    return this.state[machine][port];
  }
  setOutput(machine, port, output) {
    return this.state[machine][port] = output;
  }
  getOutputs(machine) {
    if (this.state[machine] === undefined) {
      throw new Error(Const.ErrorMessage.MACHINE_NOT_IN_STATE(machine));
    }
    return this.state[machine];
  }
  setOutputs(machine, outputs) {
    return this.state[machine] = outputs;
  }
  compare(otherState) {
    if (!(otherState instanceof State)) {
      throw new Error(Const.ErrorMessage.NOT_STATE(otherState));
    }
    const thisStateMachines = Object.keys(this.state);
    const otherStateMachines = Object.keys(otherState.state);
    if (thisStateMachines.length !== otherStateMachines.length) {
      return false;
    }
    for (const machine of thisStateMachines) {
      const thisStateMachineOutputs = this.state[machine];
      const otherStateMachineOutputs = otherState.state[machine];
      if (thisStateMachineOutputs.length !== otherStateMachineOutputs.length) {
        return false;
      }
      for (let i = 0; i < thisStateMachineOutputs.length; i++) {
        if (thisStateMachineOutputs[i] !== otherStateMachineOutputs[i]) {
          return false;
        }
      }
    }
    return true;
  }
  clone() {
    const clone = new State({});
    for (const machine in this.state) {
      clone.state[machine] = Array.from(this.state[machine]);
    }
    return clone;
  }
  // For debugging and logging purposes
  toString() {
    let stateDescriptor = "";
    for (const machine in this.state) {
      stateDescriptor += `${machine} output: ${JSON.stringify(this.state[machine])} \n`
    }
    return stateDescriptor;
  }
}
class StateHistory {
  constructor() {
    this.states = [];
  }
  addState(state) {
    if (!(state instanceof State)) {
      throw new Error(Const.ErrorMessage.NOT_STATE(state));
    }
    this.states.push(state);
  }
  getLastState() {
    if (this.states.length > 0) {
      return this.states[this.states.length - 1];
    } else {
      throw new Error(Const.ErrorMessage.STATE_HISTORY_EMPTY);
    }
  }
  isStable() {
    if (this.states.length >= 2) {
      const lastState = this.states[this.states.length - 1];
      const lastLastState = this.states[this.states.length - 2];
      return lastState.compare(lastLastState);
    } else {
      return false;
    }
  }
  isInCycle() {
    for (let i = 2; i <= Math.floor(this.states.length / 2); i++) {
      let hasCycle = true;
      const recentStates = this.states.slice().reverse().slice(0, i);
      const historyStates = this.states.slice().reverse().slice(i, 2*i);
      for (let j = 0; j < i; j++) {
        if (!recentStates[j].compare(historyStates[j])) {
          hasCycle = false;
          break;
        }
      }
      if (hasCycle) {
        return true;
      }
    }
    return false;
  }
  isEmpty() {
    return this.states.length === 0;
  }
  toString() {
    let stateDescriptor = "";
    for (let i = 0; i< this.states.length; i++) {
      stateDescriptor += `State ${i}: \n`;
      stateDescriptor += this.states[i].toString();
    }
    return stateDescriptor;
  }
}

module.exports = {
  State,
  StateHistory
}
