const SimpleMachine = require('../modules/machine');
const Const = require("../modules/const").constants;

test('test calculateOutput return outputs', () => {
  const expectedOutputs = [Const.Value.HIGH];
  const machine = new SimpleMachine("machine", {"0": [Const.Value.HIGH], "1": [Const.Value.LOW]});
  const actualOutputs = machine.calculateOutput([Const.Value.LOW]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs ON machine given ON truth table', () => {
  const expectedOutputs = [Const.Value.HIGH];
  const machine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const actualOutputs = machine.calculateOutput([]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs OFF machine given OFF truth table', () => {
  const expectedOutputs = [Const.Value.LOW];
  const machine = new SimpleMachine("off", Const.MachineTruthTable.OFF);
  const actualOutputs = machine.calculateOutput([]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs NOT machine given NOT truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH].toString()] = [Const.Value.LOW];
  const machine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs OR machine given OR truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = [Const.Value.LOW];
  expectedOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = [Const.Value.HIGH];
  const machine = new SimpleMachine("or", Const.MachineTruthTable.OR);
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.LOW]);
  actualOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.HIGH]);
  actualOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs AND machine given AND truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = [Const.Value.LOW];
  expectedOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = [Const.Value.LOW];
  expectedOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = [Const.Value.LOW];
  expectedOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = [Const.Value.HIGH];
  const machine = new SimpleMachine("and", Const.MachineTruthTable.AND);
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.LOW]);
  actualOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.HIGH]);
  actualOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs NAND machine given NAND truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = [Const.Value.LOW];
  const machine = new SimpleMachine("nand", Const.MachineTruthTable.NAND);
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.LOW]);
  actualOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.HIGH]);
  actualOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs XOR machine given XOR truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = [Const.Value.LOW];
  expectedOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = [Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = [Const.Value.LOW];
  const machine = new SimpleMachine("xor", Const.MachineTruthTable.XOR);
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.LOW]);
  actualOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.HIGH]);
  actualOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

test('test machine constructor outputs custom machine given custom truth table', () => {
  const expectedOutputs = {};
  expectedOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = [Const.Value.HIGH, Const.Value.HIGH];
  expectedOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = [Const.Value.HIGH, Const.Value.LOW];
  expectedOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = [Const.Value.LOW, Const.Value.HIGH];
  expectedOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = [Const.Value.LOW, Const.Value.LOW];
  const machine = new SimpleMachine("custom", prepareTruthTableForCustomMachine());
  const actualOutputs = {};
  actualOutputs[[Const.Value.LOW, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.LOW]);
  actualOutputs[[Const.Value.LOW, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.LOW, Const.Value.HIGH]);
  actualOutputs[[Const.Value.HIGH, Const.Value.LOW].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.LOW]);
  actualOutputs[[Const.Value.HIGH, Const.Value.HIGH].toString()] = machine.calculateOutput([Const.Value.HIGH, Const.Value.HIGH]);
  expect(actualOutputs).toEqual(expectedOutputs);
});

function prepareTruthTableForCustomMachine() {
  return {
    "00": [Const.Value.HIGH, Const.Value.HIGH],
    "01": [Const.Value.HIGH, Const.Value.LOW],
    "10": [Const.Value.LOW, Const.Value.HIGH],
    "11": [Const.Value.LOW, Const.Value.LOW],
  }
}

test('test machine constructor throws error given non-string name', () => {
  const machineConstructor = () => new SimpleMachine(undefined, Const.MachineTruthTable.XOR);
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_MACHINE_NAME(undefined));
});

test('test machine constructor throws error given incorrect string name', () => {
  const machineConstructor = () => new SimpleMachine("+123custom", Const.MachineTruthTable.XOR);
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_MACHINE_NAME("+123custom"));
});

test('test machine constructor throws error given incorrect truth table (non-object)', () => {
  const machineConstructor = () => new SimpleMachine("custom", "truth table");
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test machine constructor throws error given incorrect truth table (empty object)', () => {
  const machineConstructor = () => new SimpleMachine("custom", {});
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test machine constructor throws error given incorrect truth table (disallowed input)', () => {
  const machineConstructor = () => new SimpleMachine("custom", {"abc": [Const.Value.LOW]});
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test machine constructor throws error given incorrect truth table (disallowed output)', () => {
  const machineConstructor = () => new SimpleMachine("custom", {"": [[]]});
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test machine constructor throws error given incorrect truth table (incomplete truth table)', () => {
  const machineConstructor = () => new SimpleMachine("custom", {"0": [Const.Value.LOW]});
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test machine constructor throws error given incorrect truth table (variable-length outputs)', () => {
  const machineConstructor = () => new SimpleMachine("custom", {
    "0": [Const.Value.LOW],
    "1": [Const.Value.LOW, Const.Value.LOW],
  });
  expect(machineConstructor).toThrow(Const.ErrorMessage.INVALID_TRUTH_TABLE("custom"));
});

test('test getOutputDimension given zero-dimensional machine', () => {
  const expectedOutputDimension = 0;
  const machine = new SimpleMachine("null", {"":[]});
  const actualOutputDimension = machine.getOutputDimension();
  expect(actualOutputDimension).toEqual(expectedOutputDimension);
});

test('test getOutputDimension given one-dimensional machine', () => {
  const expectedOutputDimension = 1;
  const machine = new SimpleMachine("null", {"":[Const.Value.LOW]});
  const actualOutputDimension = machine.getOutputDimension();
  expect(actualOutputDimension).toEqual(expectedOutputDimension);
});

test('test getOutputDimension given multi-dimensional machine', () => {
  const expectedOutputDimension = 4;
  const machine = new SimpleMachine("null", {"":[Const.Value.LOW, Const.Value.LOW, Const.Value.LOW, Const.Value.LOW]});
  const actualOutputDimension = machine.getOutputDimension();
  expect(actualOutputDimension).toEqual(expectedOutputDimension);
});

test('test getInputDimension given zero-dimensional machine', () => {
  const expectedInputDimension = 0;
  const machine = new SimpleMachine("null", {"":[]});
  const actualInputDimension = machine.getInputDimension();
  expect(actualInputDimension).toEqual(expectedInputDimension);
});

test('test getInputDimension given one-dimensional machine', () => {
  const expectedInputDimension = 1;
  const machine = new SimpleMachine("null", {"0":[], "1":[]});
  const actualInputDimension = machine.getInputDimension();
  expect(actualInputDimension).toEqual(expectedInputDimension);
});

test('test getInputDimension given multi-dimensional machine', () => {
  const expectedInputDimension = 3;
  const machine = new SimpleMachine("null", {
    "000":[], "001":[], "010":[], "011":[], "100":[], "101":[], "110":[], "111":[]
  });
  const actualInputDimension = machine.getInputDimension();
  expect(actualInputDimension).toEqual(expectedInputDimension);
});
