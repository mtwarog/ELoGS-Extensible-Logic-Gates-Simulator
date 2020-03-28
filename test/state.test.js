const stateProvider = require('../modules/state');
const SimpleMachine = require('../modules/machine');
const Const = require("../modules/const").constants;

test('test State construtor outputs state with machines', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const state = new stateProvider.State(machines);
  expect(state.getOutput(machine.getId(), Const.Port.A)).toEqual(Const.Value.UNDEFINED);
});

test('test State getOutputs outputs state for machine outputs', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const state = new stateProvider.State(machines);
  const expectedOutputs = [Const.Value.UNDEFINED];
  expect(state.getOutputs(machine.getId())).toEqual(expectedOutputs);
});

test('test State compare outputs true for equal states', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = new stateProvider.State(machines);
  expect(stateOne.compare(stateTwo)).toBe(true);
});

test('test State compare outputs false for not equal states', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  machines[machineOne.getId()] = machineOne;
  const stateOne = new stateProvider.State(machines);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.NOT);
  machines[machineTwo.getId()] = machineTwo;
  const stateTwo = new stateProvider.State(machines);
  expect(stateOne.compare(stateTwo)).toBe(false);
});

test('test State compare throws error on non-State parameter', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  machines[machineOne.getId()] = machineOne;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = {"state":[]};
  const compareStates = () => stateOne.compare(stateTwo);
  expect(compareStates).toThrow(Const.ErrorMessage.NOT_STATE(stateTwo));
});

test('test State clone outputs state equal to original one', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = stateOne.clone();
  expect(stateOne.compare(stateTwo)).toBe(true);
});

test('test StateHistory constructor outputs empty StateHistory', () => {
  const stateHistory = new stateProvider.StateHistory();
  expect(stateHistory.isEmpty()).toBe(true);
});

test('test StateHistory addState throws error on not-state parameter', () => {
  const machines = {};
  const state = {"state":[]};
  const stateHistory = new stateProvider.StateHistory();
  const addIncorrectState = () => stateHistory.addState(state);
  expect(addIncorrectState).toThrow(Const.ErrorMessage.NOT_STATE(state));
});

test('test StateHistory isStable outputs false for empty history', () => {
  const stateHistory = new stateProvider.StateHistory();
  expect(stateHistory.isStable()).toEqual(false);
});

test('test StateHistory isStable outputs false for single-state history', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const state = new stateProvider.State(machines);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(state);
  expect(stateHistory.isStable()).toEqual(false);
});

test('test StateHistory isStable outputs false for two different states history', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const stateOne = new stateProvider.State(machines);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.NOT);
  machines[machineTwo.getId()] = machineTwo;
  const stateTwo = new stateProvider.State(machines);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  expect(stateHistory.isStable()).toEqual(false);
});

test('test StateHistory isStable outputs true for two same states history', () => {
  const machines = {};
  const machine = new SimpleMachine("machine", Const.MachineTruthTable.ON);
  machines[machine.getId()] = machine;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = new stateProvider.State(machines);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  expect(stateHistory.isStable()).toEqual(true);
});

test('test StateHistory isStable outputs true for complex not-stable states history', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  machines[machineOne.getId()] = machineOne;
  const stateOne = new stateProvider.State(machines);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.ON);
  machines[machineTwo.getId()] = machineTwo;
  const stateTwo = new stateProvider.State(machines);
  const machineThree = new SimpleMachine("machineThree", Const.MachineTruthTable.OR);
  machines[machineThree.getId()] = machineThree;
  const stateThree = new stateProvider.State(machines);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  stateHistory.addState(stateThree);
  expect(stateHistory.isStable()).toEqual(false);
});

test('test StateHistory isStable outputs false for complex stable states history', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  machines[machineOne.getId()] = machineOne;
  const stateOne = new stateProvider.State(machines);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.ON);
  machines[machineTwo.getId()] = machineTwo;
  const stateTwo = new stateProvider.State(machines);
  const stateThree = new stateProvider.State(machines);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  stateHistory.addState(stateThree);
  expect(stateHistory.isStable()).toEqual(true);
});

test('test StateHistory isInCycle outputs false for history without cycle', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.NOT);
  machines[machineOne.getId()] = machineOne;
  machines[machineTwo.getId()] = machineTwo;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = new stateProvider.State(machines);
  stateTwo.setOutputs(machineOne.getId(), [Const.Value.HIGH]);
  const stateThree = new stateProvider.State(machines);
  stateThree.setOutputs(machineTwo.getId(), [Const.Value.LOW]);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  stateHistory.addState(stateThree);
  expect(stateHistory.isInCycle()).toEqual(false);
});

test('test StateHistory isInCycle outputs true for history with cycle from beginning', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.NOT);
  machines[machineOne.getId()] = machineOne;
  machines[machineTwo.getId()] = machineTwo;
  const stateOne = new stateProvider.State(machines);
  stateOne.setOutputs(machineOne.getId(), [Const.Value.LOW]);
  const stateTwo = new stateProvider.State(machines);
  stateTwo.setOutputs(machineOne.getId(), [Const.Value.HIGH]);
  const stateThree = new stateProvider.State(machines);
  stateThree.setOutputs(machineOne.getId(), [Const.Value.LOW]);
  const stateFour = new stateProvider.State(machines);
  stateFour.setOutputs(machineOne.getId(), [Const.Value.HIGH]);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  stateHistory.addState(stateThree);
  stateHistory.addState(stateFour);
  expect(stateHistory.isInCycle()).toBe(true);
});

test('test StateHistory isInCycle outputs true for history with acquired cycle', () => {
  const machines = {};
  const machineOne = new SimpleMachine("machineOne", Const.MachineTruthTable.ON);
  const machineTwo = new SimpleMachine("machineTwo", Const.MachineTruthTable.NOT);
  machines[machineOne.getId()] = machineOne;
  machines[machineTwo.getId()] = machineTwo;
  const stateOne = new stateProvider.State(machines);
  const stateTwo = new stateProvider.State(machines);
  stateTwo.setOutputs(machineOne.getId(), [Const.Value.HIGH]);
  const stateThree = new stateProvider.State(machines);
  stateThree.setOutputs(machineTwo.getId(), [Const.Value.LOW]);
  const stateFour = new stateProvider.State(machines);
  stateFour.setOutputs(machineTwo.getId(), [Const.Value.HIGH]);
  const stateFive = new stateProvider.State(machines);
  stateFive.setOutputs(machineTwo.getId(), [Const.Value.LOW]);
  const stateSix = new stateProvider.State(machines);
  stateSix.setOutputs(machineTwo.getId(), [Const.Value.HIGH]);
  const stateHistory = new stateProvider.StateHistory();
  stateHistory.addState(stateOne);
  stateHistory.addState(stateTwo);
  stateHistory.addState(stateThree);
  stateHistory.addState(stateFour);
  stateHistory.addState(stateFive);
  stateHistory.addState(stateSix);
  expect(stateHistory.isInCycle()).toBe(true);
});
