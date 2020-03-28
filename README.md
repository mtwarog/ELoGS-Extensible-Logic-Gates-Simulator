# ELoGS - Extensible Logic Gates Simulator
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)  
This simulator:
  - can be used to calculate logical output of connected [logic gates](https://en.wikipedia.org/wiki/Logic_gate).  
  - supports calculations on insufficient data (i.e. not all inputs defined)
  - supports feedback loops in circuits  

**Extensible** means that it allows user to define new machines(gates) by providing truth tables.  
## 1. Installation
```
npm install logic-gates
```
## 2. Usage
In Node:
```javascript
// Class representing circuit:
const Circuit = require("logic-gates").circuit;
// Constants like truth tables, machine ports, output values
const Const = require("logic-gates").constants;
// Create circuit
const circuit = new Circuit();
```
## 3. Example
Below example implements and simulate following logic circuit:
![Circuit example](/images/logic_gates_example.svg?raw=true "Circuit example")
```javascript
const Circuit = require("logic-gates").circuit;
const Const = require("logic-gates").constants;

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
console.log(`State of "and" machine: ${simulationResult.state["and"]}`);
console.log("Human-readable form of whole circuit output state:")
console.log(simulationResult.toString());
```
## 4. Circuit
Circuit is a set of machines and connections between them. Simulation of circuit returns State object which contains all outputs of all machines(gates) present in circuit. If not all inputs are connected, some outputs might be undefined.
### 4.1. Adding Machines (Gates)
To add machine to circuit one need to use `addMachine` method. `constants` object contains [set of predefined machines](###5.1.-predefined-machines) which can be used as follows:
```javascript
circuit.addMachine("predefinedMachineName", Const.MachineTruthTable.ON);
```
Custom machines can be specified by providing custom truth table:
```javascript
circuit.addMachine("customMachineName", {"00": [Value.HIGH], "01": [Value.HIGH], "10": [Value.LOW], "11": [Value.LOW]});
```
More on adding custom machines: [Custom Machines](###5.2.-custom-machines)
### 4.2. Adding Connections
After adding machines one need to specify connections between output port of one machines to input port of other machine. To add connection one need to use `addConnection()` method:
```javascript
circuit.addConnection("outputMachine", Const.Port.A,  "inputMachine", Const.Port.A);
```
All machines should be fully connected, but simulation can also be run on insufficient data. In such case some outputs might be undefined.  
### 4.3. Running Simulation
After adding machines and connections to circuit it can be simulated by calling `simulate()` method:
```javascript
const simulationResult = circuit.simulate();
```
### 4.4. Reading Simulation Result
Reading outputs of specific machine:
```javascript
const machineoutputs = simulationResult.state["machineName"]
```
Reading specific output of specific machine:
```javascript
const outputPortA = simulationResult.state["machineName"][Const.Port.A];
```
Getting human-readable description of whole circuit state:
```javascript
const allMachinesOutputs = simulationResult.toString();
```
## 5. Machines (Gates)
In `constants` object one can find predefined machines. It is also feasible to define custom Machine by providing truth table representing complete binary function. The function describes mapping from boolean inputs to boolean outputs.  
### 5.1. Predefined Machines
To be able to use predefined machines one need to import `constants` object Const first:
```javascript
const Const = require("logic-gates").constants;
```
List of available predefined machines:

| Machine | Truth Table |
| ------------- |:-------------:|
| Not | Const.MachineTruthTable.NOT |
| Or | Const.MachineTruthTable.OR |
| And | Const.MachineTruthTable.AND |
| Nor(Not Or) | Const.MachineTruthTable.NOR |
| Nand(Not And) | Const.MachineTruthTable.NAND |
| Xor(Exclusive Or) | Const.MachineTruthTable.XOR |

There are also source machines (having no input and single output):

| Machine | Truth Table |
| ------------- |:-------------:|
| High source | Const.MachineTruthTable.ON |
| Low source | Const.MachineTruthTable.OFF |

To add machine to circuit see: [Adding Machines (Gates)](###4.1.-adding-machines-(gates))
### 5.2. Custom Machines
Custom machines are machines for which truth table is specified by custom object instead of predefined one from `constants` object.  
Truth table object must specify outputs for all possible inputs. It means that e.g. if machine has two input ports and two output ports, then all output values must be defined for each combination of input ports values.  

Lets define exemplary custom machine with 2 inputs and 2 outputs. In this case there should be 4 combinations:  
| Input Ports Values        | Output Ports Values           |
|:-------------:|:-------------:|
| A = 0, B = 0 | A = 1, B = 1 |
| A = 0, B = 1 | A = 0, B = 0 |
| A = 1, B = 0 | A = 1, B = 0 |
| A = 1, B = 1 | A = 1, B = 1 |
Above table should be represented by below object:
```javascript
const customTruthTable = {
  "00": [Const.Value.HIGH, Const.Value.HIGH],
  "01": [Const.Value.LOW, Const.Value.LOW],
  "10": [Const.Value.HIGH, Const.Value.LOW],
  "11": [Const.Value.HIGH, Const.Value.HIGH],
}
```
Property names in the object are values of input ports concatenated into string.  
Property values in the object are tables of output values.  

Such object can be used to create new machine:
```javascript
circuit.addMachine("newMachine", customTruthTable);
```
## 6. Limitations
Only static circuits(not dependent on time) can be simulated.  
No clocks support in current version.  
