const Circuit = require("../index.js").circuit;
const Const = require("../index.js").constants;

const circuit = new Circuit();
circuit.addMachine("X1", Const.MachineTruthTable.ON);
circuit.addMachine("X2", Const.MachineTruthTable.ON);
circuit.addMachine("X3", Const.MachineTruthTable.ON);
circuit.addMachine("not1", Const.MachineTruthTable.NOT);
circuit.addMachine("not2", Const.MachineTruthTable.NOT);
circuit.addMachine("and1", Const.MachineTruthTable.AND);
circuit.addMachine("and2", Const.MachineTruthTable.AND);
circuit.addMachine("and3", Const.MachineTruthTable.AND);
circuit.addMachine("or1", Const.MachineTruthTable.OR);
circuit.addMachine("or2", Const.MachineTruthTable.OR);
circuit.addConnection("X1", Const.Port.A,  "not1", Const.Port.A);
circuit.addConnection("X1", Const.Port.A,  "and2", Const.Port.A);
circuit.addConnection("X2", Const.Port.A,  "not2", Const.Port.A);
circuit.addConnection("X2", Const.Port.A,  "and1", Const.Port.B);
circuit.addConnection("X3", Const.Port.A,  "and3", Const.Port.B);
circuit.addConnection("not1", Const.Port.A,  "and1", Const.Port.A);
circuit.addConnection("not2", Const.Port.A,  "and2", Const.Port.B);
circuit.addConnection("not2", Const.Port.A,  "and3", Const.Port.A);
circuit.addConnection("and1", Const.Port.A,  "or1", Const.Port.A);
circuit.addConnection("and2", Const.Port.A,  "or1", Const.Port.B);
circuit.addConnection("and3", Const.Port.A,  "or2", Const.Port.B);
circuit.addConnection("or1", Const.Port.A,  "or2", Const.Port.A);
const simulationResult = circuit.simulate();

console.log(`Value of Y (for X1,X2,X3 = 1 (High)): ${simulationResult.state["or2"][Const.Port.A]}`);
console.log("Get output state of specific machine: ");
console.log(`State of "and1" machine: ${simulationResult.state["and1"]}`);
console.log("Human-readable form of whole circuit output state:")
console.log(simulationResult.toString());
