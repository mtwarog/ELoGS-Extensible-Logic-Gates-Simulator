const Circuit = require('../modules/circuit');
const Connection = require('../modules/connection');
const SimpleMachine = require("../modules/machine");
const stateProvider = require("../modules/state");
const Const = require("../modules/const").constants;

test('test addMachine adds machine to circuit', () => {
  const circuit = new Circuit();
  circuit.addMachine("highSource", Const.MachineTruthTable.ON);
  expect(circuit._getMachineByName("highSource")).toBeDefined();
});

test('test addMachine throws error when adding existing machine', () => {
  const circuit = new Circuit();
  circuit.addMachine("highSource", Const.MachineTruthTable.ON);
  const addDuplicate = circuit.addMachine.bind(circuit, "highSource", Const.MachineTruthTable.NOT);
  expect(addDuplicate).toThrow(Const.ErrorMessage.DUPLICATE_MACHINE("highSource"));
});

test('test removeMachine removes machine from circuit', () => {
  const circuit = new Circuit();
  circuit.addMachine("highSource", Const.MachineTruthTable.ON);
  circuit.removeMachine("highSource");
  expect(circuit._getMachineByName("highSource")).toBeNull();
});

test('test removeMachine throws error when removing non-existent machine', () => {
  const circuit = new Circuit();
  const removeNonExistent = circuit.removeMachine.bind(circuit, "highSource");
  expect(removeNonExistent).toThrow(Const.ErrorMessage.NON_EXISTENT_MACHINE("highSource"));
});

test('test addConnection adds connection to circuit', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  const inputMachine = circuit._getMachineByName("input");
  const notMachine = circuit._getMachineByName("not");
  const exprectedConnection = new Connection(inputMachine, Const.Port.A, notMachine, Const.Port.A);
  circuit.addConnection("input", Const.Port.A, "not", Const.Port.A);
  const createdConnection = circuit._getConnection("input", Const.Port.A, "not", Const.Port.A);
  expect(createdConnection).toEqual(exprectedConnection);
});

test('test addConnection throws error when connecting to non-existing machine', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  const addToNonExistent = circuit.addConnection.bind(circuit, "input", Const.Port.A, "not", Const.Port.A);
  expect(addToNonExistent).toThrow(Const.ErrorMessage.NON_EXISTENT_MACHINE("not"));
});

test('test addConnection throws error when connecting to output port out of bound', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  const inputMachineOutputDimension = 1;
  const addToNonExistent = circuit.addConnection.bind(circuit, "input", Const.Port.B, "not", Const.Port.A);
  expect(addToNonExistent).toThrow(Const.ErrorMessage.PORT_OUT_OF_RANGE(true, "input", Const.Port.B, inputMachineOutputDimension));
});

test('test addConnection throws error when connecting to input port out of bound', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  const notMachineinputDimension = 1;
  const addToNonExistent = circuit.addConnection.bind(circuit, "input", Const.Port.A, "not", Const.Port.B);
  expect(addToNonExistent).toThrow(Const.ErrorMessage.PORT_OUT_OF_RANGE(false, "not", Const.Port.B, notMachineinputDimension));
});

test('test removeConnection removes connection from circuit', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  circuit.addConnection("input", Const.Port.A, "not", Const.Port.A);
  circuit.removeConnection("input", Const.Port.A, "not", Const.Port.A);
  const createdConnection = circuit._getConnection("input", Const.Port.A, "not", Const.Port.A);
  expect(createdConnection).toBeNull();
});

test('test removeConnection throws error when removing non-existent connection', () => {
  const circuit = new Circuit();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  const removeNonExistent = circuit.removeConnection.bind(circuit, "input", Const.Port.A, "not", Const.Port.A);
  expect(removeNonExistent).toThrow(Const.ErrorMessage.CONNECTION_DOESNT_EXIST("input", Const.Port.A, "not", Const.Port.A));
});

test('test simulate with no machines, returns empty state', () => {
  const circuit = new Circuit();
  const expectedState = {"state":{}};
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

test('test simulate with non-input machine only, returns state with one machine', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithNonInputMachineOnly();
  circuit.addMachine("nonInputMachine", Const.MachineTruthTable.NOT);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithNonInputMachineOnly() {
  const machines = {
    "nonInputMachine": new SimpleMachine("nonInputMachine", Const.MachineTruthTable.NOT),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("nonInputMachine", [Const.Value.UNDEFINED]);
  return expectedState;
}

test('test simulate with input machine only, returns state with one machine', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithInputMachineOnly();
  circuit.addMachine("inputMachine", Const.MachineTruthTable.ON);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithInputMachineOnly() {
  const machines = {
    "inputMachine": new SimpleMachine("inputMachine", Const.MachineTruthTable.ON),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("inputMachine", [Const.Value.HIGH]);
  return expectedState;
}

test('test simulate with two unconnected machines only, returns state with both machines', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithTwoUnconnectedMachines();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithTwoUnconnectedMachines() {
  const machines = {
    "input": new SimpleMachine("input", Const.MachineTruthTable.ON),
    "not": new SimpleMachine("not", Const.MachineTruthTable.NOT),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("input", [Const.Value.HIGH]);
  expectedState.setOutputs("not", [Const.Value.UNDEFINED]);
  return expectedState;
}

test('test simulate with two connected machines only, returns state with both machines', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithTwoConnectedMachines();
  circuit.addMachine("input", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  circuit.addConnection("input", Const.Port.A, "not", Const.Port.A);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithTwoConnectedMachines() {
  const machines = {
    "input": new SimpleMachine("input", Const.MachineTruthTable.ON),
    "not": new SimpleMachine("not", Const.MachineTruthTable.NOT),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("input", [Const.Value.HIGH]);
  expectedState.setOutputs("not", [Const.Value.LOW]);
  return expectedState;
}

test('test simulate with multiple connected machines', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithMultipleConnectedMachines();
  circuit.addMachine("highSource", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  circuit.addMachine("or", Const.MachineTruthTable.OR);
  circuit.addMachine("highSource2", Const.MachineTruthTable.ON);
  circuit.addMachine("not2", Const.MachineTruthTable.NOT);
  circuit.addMachine("and", Const.MachineTruthTable.AND);
  circuit.addConnection("highSource", Const.Port.A,  "or", Const.Port.A);
  circuit.addConnection("highSource", Const.Port.A,  "or", Const.Port.B);
  circuit.addConnection("or", Const.Port.A,  "not", Const.Port.A);
  circuit.addConnection("highSource2", Const.Port.A,  "and", Const.Port.A);
  circuit.addConnection("not2", Const.Port.A,  "and", Const.Port.B);
  circuit.addConnection("not", Const.Port.A,  "not2", Const.Port.A);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithMultipleConnectedMachines() {
  const machines = {
    "highSource": new SimpleMachine("highSource", Const.MachineTruthTable.ON),
    "not": new SimpleMachine("not", Const.MachineTruthTable.NOT),
    "or": new SimpleMachine("or", Const.MachineTruthTable.OR),
    "highSource2": new SimpleMachine("highSource2", Const.MachineTruthTable.ON),
    "not2": new SimpleMachine("not2", Const.MachineTruthTable.NOT),
    "and": new SimpleMachine("and", Const.MachineTruthTable.AND),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("highSource", [Const.Value.HIGH]);
  expectedState.setOutputs("not", [Const.Value.LOW]);
  expectedState.setOutputs("or", [Const.Value.HIGH]);
  expectedState.setOutputs("highSource2", [Const.Value.HIGH]);
  expectedState.setOutputs("not2", [Const.Value.HIGH]);
  expectedState.setOutputs("and", [Const.Value.HIGH]);
  return expectedState;
}

test('test simulate with multiple connected machines with feedback loop', () => {
  const circuit = new Circuit();
  const expectedState = prepareStateForTestSimulateWithMultipleConnectedMachinesWithFeedbackLoop();
  circuit.addMachine("highSource", Const.MachineTruthTable.ON);
  circuit.addMachine("not", Const.MachineTruthTable.NOT);
  circuit.addMachine("or", Const.MachineTruthTable.OR);
  circuit.addMachine("highSource2", Const.MachineTruthTable.ON);
  circuit.addMachine("not2", Const.MachineTruthTable.NOT);
  circuit.addMachine("and", Const.MachineTruthTable.AND);
  circuit.addConnection("highSource", Const.Port.A,  "or", Const.Port.A);
  circuit.addConnection("or", Const.Port.A,  "or", Const.Port.B);
  circuit.addConnection("or", Const.Port.A,  "not", Const.Port.A);
  circuit.addConnection("highSource2", Const.Port.A,  "and", Const.Port.A);
  circuit.addConnection("not2", Const.Port.A,  "and", Const.Port.B);
  circuit.addConnection("not", Const.Port.A,  "not2", Const.Port.A);
  const state = circuit.simulate();
  expect(state).toEqual(expectedState);
});

function prepareStateForTestSimulateWithMultipleConnectedMachinesWithFeedbackLoop() {
  const machines = {
    "highSource": new SimpleMachine("highSource", Const.MachineTruthTable.ON),
    "not": new SimpleMachine("not", Const.MachineTruthTable.NOT),
    "or": new SimpleMachine("or", Const.MachineTruthTable.OR),
    "highSource2": new SimpleMachine("highSource2", Const.MachineTruthTable.ON),
    "not2": new SimpleMachine("not2", Const.MachineTruthTable.NOT),
    "and": new SimpleMachine("and", Const.MachineTruthTable.AND),
  };
  const expectedState = new stateProvider.State(machines);
  expectedState.setOutputs("highSource", [Const.Value.HIGH]);
  expectedState.setOutputs("not", [Const.Value.LOW]);
  expectedState.setOutputs("or", [Const.Value.HIGH]);
  expectedState.setOutputs("highSource2", [Const.Value.HIGH]);
  expectedState.setOutputs("not2", [Const.Value.HIGH]);
  expectedState.setOutputs("and", [Const.Value.HIGH]);
  return expectedState;
}
