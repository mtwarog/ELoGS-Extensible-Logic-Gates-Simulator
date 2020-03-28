const stateProvider = require("./state");
const Connection = require("./connection");
const SimpleMachine = require("./machine");
const Const = require("./const").constants;

class Circuit {
  constructor() {
    this.machines = {};
    this.connectionGraph = {};
    this.stateHistory = new stateProvider.StateHistory();
    this.currentState = new stateProvider.State([]);
  }
  _getMachines() {
    return this.machines;
  }
  _getMachineById(machineId) {
    return this.machines[machineId];
  }
  _getMachineByName(machineName) {
    for (const machineId in this.machines) {
      if (this.machines[machineId].getName() === machineName) {
        return this.machines[machineId];
      }
    }
    return null;
  }
  addMachine(name, machineTruthTable) {
    if (this._getMachineByName(name) !== null) {
      throw new Error(Const.ErrorMessage.DUPLICATE_MACHINE(name));
    }
    const machine = new SimpleMachine(name, machineTruthTable);
    this._addMachine(machine);
  }
  _addMachine(machine) {
    this.machines[machine.getId()] = machine;
    this.connectionGraph[machine.getId()] = {inputs: [], outputs: []};
    this._invalidateState();
  }
  removeMachine(machineId) {
    const machineToRemove = this._getMachineByName(machineId);
    if (this._getMachineByName(machineId) === null) {
      throw new Error(Const.ErrorMessage.NON_EXISTENT_MACHINE(machineId));
    }
    this._removeMachine(machineToRemove);
  }
  _removeMachine(machine) {
    delete this.machines[machine.getId()];
    delete this.connectionGraph[machine.getId()];
    this._invalidateState();
  }
  addConnection(outMachineId, outPort, inMachineId, inPort) {
    const outMachine = this._getMachineByName(outMachineId);
    const inMachine = this._getMachineByName(inMachineId);
    if (outMachine === null) {
      throw new Error(Const.ErrorMessage.NON_EXISTENT_MACHINE(outMachineId));
    }
    if (inMachine === null) {
      throw new Error(Const.ErrorMessage.NON_EXISTENT_MACHINE(inMachineId));
    }
    if (outPort >= outMachine.getOutputDimension()) {
      throw new Error(Const.ErrorMessage.PORT_OUT_OF_RANGE(true, outMachineId, outPort, outMachine.getOutputDimension()));
    }
    if (inPort >= inMachine.getInputDimension()) {
      throw new Error(Const.ErrorMessage.PORT_OUT_OF_RANGE(false, inMachineId, inPort, inMachine.getInputDimension()));
    }
    const connection = new Connection(outMachine, outPort,  inMachine, inPort);
    this._addConnection(connection);
  }
  _addConnection(connection) {
    this.connectionGraph[connection.getOutMachine().getId()].outputs.push(connection.getConnectionToInput());
    this.connectionGraph[connection.getInMachine().getId()].inputs.push(connection.getConnectionToOutput());
    this._invalidateState();
  }
  _getConnection(outMachineId, outPort, inMachineId, inPort) {
    const outMachine = this._getMachineByName(outMachineId);
    const inMachine = this._getMachineByName(inMachineId);

    if (outMachine === null || inMachine === null) {
      return null;
    }

    let connectionToInput = this._getConnectionToInput(
      this.connectionGraph[outMachine.getId()].outputs, inMachine, inPort);
    let connectionToOutput = this._getConnectionToOutput(
      this.connectionGraph[inMachine.getId()].inputs, outMachine, outPort);

    let connection = null;
    if (connectionToInput !== null && connectionToOutput !== null) {
      connection = new Connection(connectionToOutput.getOutMachine(),
        connectionToOutput.getOutPort(),
        connectionToInput.getInMachine(),
        connectionToInput.getInPort());
    }

    return connection;
  }
  _getConnectionToInput(outputs, inMachine, inPort) {
    for (const connectionToIn of outputs) {
      if (connectionToIn.getInMachine() === inMachine
          && connectionToIn.getInPort() === inPort) {
          return connectionToIn;
      }
    }
    return null;
  }
  _getConnectionToOutput(inputs, outMachine, outPort) {
    for (const connectionToOut of inputs) {
      if (connectionToOut.getOutMachine() === outMachine
          && connectionToOut.getOutPort() === outPort) {
          return connectionToOut;
      }
    }
    return null;
  }
  removeConnection(outMachineId, outPort, inMachineId, inPort) {
    const connection = this._getConnection(outMachineId, outPort, inMachineId, inPort);
    if (connection === null) {
      throw Const.ErrorMessage.CONNECTION_DOESNT_EXIST(outMachineId, outPort, inMachineId, inPort);
    }
    this._removeConnection(connection);
  }
  _removeConnection(connection) {
    const outputs = this.connectionGraph[connection.getOutMachine()].outputs;
    const connectionOutputIdx = outputs.indexOf(connection.getConnectionToInput());
    outputs.splice(connectionOutputIdx, 1);
    const inputs = this.connectionGraph[connection.getInMachine()].inputs;
    const connectionInputIdx = inputs.indexOf(connection.getConnectionToOutput());
    inputs.splice(connectionInputIdx, 1);
    this._invalidateState();
  }
  simulate(initialState) {
    this._invalidateState();
    if (initialState) {
      this.currentState = initialState.clone();
    }
    const inputMachines = this._findInputMachines();
    inputMachines.forEach((inMachine) => {
      this._simulateMachine(inMachine);
    });
    return this._getFinalState();
  }
  _simulateMachine(machine) {
    let inputs = this._findAllMachineInputs(machine);
    if (inputs === Const.Value.UNDEFINED) {
      let undefinedOutputs = new Array(this._getMachineById(machine).getOutputDimension());
      undefinedOutputs = undefinedOutputs.fill(Const.Value.UNDEFINED);
      this._updateState(machine, undefinedOutputs);
    } else {
      inputs = inputs.map(input => input === Const.Value.UNDEFINED ? Const.Value.LOW : input);
      const outputs = this._getMachineById(machine).calculateOutput(inputs);
      this._updateState(machine, outputs);
    }
    if (this.stateHistory.isStable() || this.stateHistory.isInCycle()) {
      return;
    }
    const machineOutConnections = this.connectionGraph[machine].outputs;
    for (const connection of machineOutConnections) {
      const targetMachine = connection.getInMachine()
      this._simulateMachine(targetMachine.getId());
    }
  }
  _updateState(machine, outputs) {
    this.currentState.setOutputs(machine, outputs);
    this.stateHistory.addState(this.currentState.clone());
  }
  _getFinalState() {
    return this.stateHistory.isEmpty()
      ? this.currentState.clone()
      : this.stateHistory.getLastState().clone();
  }
  _findAllMachineInputs(machine, searchTriggeringMachines = []) {
    if (searchTriggeringMachines.includes(String(machine))) {
      return Const.Value.UNDEFINED;
    }
    searchTriggeringMachines.push(String(machine));
    const inputs = [];
    const machineInConnections = this.connectionGraph[machine].inputs;
    for (const connection of machineInConnections) {
      const sourcePort = connection.getOutPort();
      const sourceMachine = connection.getOutMachine()
      let sourceMachineInputs = this._findAllMachineInputs(sourceMachine.getId(), searchTriggeringMachines);
      if (sourceMachineInputs === Const.Value.UNDEFINED) {
        inputs.push(Const.Value.UNDEFINED);
        continue;
      }
      sourceMachineInputs = sourceMachineInputs.map(input => input === Const.Value.UNDEFINED ? Const.Value.LOW : input);
      const input = sourceMachine.getOutputOnPort(sourceMachineInputs, sourcePort);
      inputs.push(input);
    }
    return inputs;
  }
  _findInputMachines() {
    return Object.keys(this._getMachines()).filter(
      machineId => this._getMachineById(machineId).getInputDimension() === 0
    );
  }
  _invalidateState() {
    this.stateHistory = new stateProvider.StateHistory();
    this.currentState = new stateProvider.State(this._getMachines());
  }
}

module.exports = Circuit;
