const Connection = require('../modules/connection');
const SimpleMachine = require('../modules/machine');
const Const = require("../modules/const").constants;

test('test connection constructor outputs connection with output machine', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const connection = new Connection(outMachine, outPort, inMachine, inPort);
  expect(connection.getOutMachine()).toEqual(outMachine);
});

test('test connection constructor outputs connection with output machine', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const connection = new Connection(outMachine, outPort, inMachine, inPort);
  expect(connection.getOutPort()).toEqual(outPort);
});

test('test connection constructor outputs connection with output machine', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const connection = new Connection(outMachine, outPort, inMachine, inPort);
  expect(connection.getInMachine()).toEqual(inMachine);
});

test('test connection constructor outputs connection with output machine', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const connection = new Connection(outMachine, outPort, inMachine, inPort);
  expect(connection.getInPort()).toEqual(inPort);
});

test('test connection constructor throws error on wrong input port type', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = "Port A";
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const createConnection = () => new Connection(outMachine, outPort, inMachine, inPort);
  expect(createConnection).toThrow(Const.ErrorMessage.NOT_PORT(inPort));
});

test('test connection constructor throws error on wrong output port type', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = "Port A";
  const createConnection = () => new Connection(outMachine, outPort, inMachine, inPort);
  expect(createConnection).toThrow(Const.ErrorMessage.NOT_PORT(outPort));
});

test('test connection constructor throws error on wrong input machine type', () => {
  const inMachine = "on machine";
  const inPort = Const.Port.A;
  const outMachine = new SimpleMachine("not", Const.MachineTruthTable.NOT);
  const outPort = Const.Port.A;
  const createConnection = () => new Connection(outMachine, outPort, inMachine, inPort);
  expect(createConnection).toThrow(Const.ErrorMessage.NOT_MACHINE(inMachine));
});

test('test connection constructor throws error on wrong output machine type', () => {
  const inMachine = new SimpleMachine("on", Const.MachineTruthTable.ON);
  const inPort = Const.Port.A;
  const outMachine = "on machine";
  const outPort = Const.Port.A;
  const createConnection = () => new Connection(outMachine, outPort, inMachine, inPort);
  expect(createConnection).toThrow(Const.ErrorMessage.NOT_MACHINE(outMachine));
});
