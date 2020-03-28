const Circuit = require("../index.js").circuit;
const Const = require("../index.js").constants;

const circuit = new Circuit();
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
const circuitState = circuit.simulate();

console.log("Get output state of specific machine: ");
console.log(`State of "and" machine: ${circuitState.state["and"]}`);
console.log("Human-readable form of whole circuit output state:")
console.log(circuitState.toString());
