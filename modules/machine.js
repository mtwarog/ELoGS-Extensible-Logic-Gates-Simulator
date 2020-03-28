const Const = require("./const").constants;

const truthTableValidator = {
  validate: (truthTable) => {
    if (!(truthTable instanceof Object)) {
      return false;
    }
    return (truthTableValidator._validateInputs(Object.keys(truthTable))
      && truthTableValidator._validateOutputs(Object.values(truthTable)));
  },
  _validateInputs: (inputs) => {
    if (inputs.length === 0) {
      return false;
    }
    const inputLength = inputs[0].length;
    for (const input of inputs) {
      if (!truthTableValidator._isValidInput(input, inputLength)) {
        return false;
      }
    }
    return (inputs.length === Math.pow(2, inputLength));
  },
  _isValidInput: (input, inputLength) => {
    return truthTableValidator._validInputRegExp.test(input) && (input.length === inputLength);
  },
  _validateOutputs: (outputs) => {
    if (outputs.length === 0) {
      return false;
    }
    let outputLength;
    if (outputs[0] instanceof Array) {
      outputLength = outputs[0].length;
    } else {
      return false;
    }
    for (const output of outputs) {
      if (!truthTableValidator._isValidOutput(output, outputLength)) {
        return false;
      }
    }
    return true;
  },
  _isValidOutput: (output, outputLength) => {
    for (const value of output) {
      if (!truthTableValidator._isValidValue(value)) {
        return false;
      }
    }
    return (output instanceof Array) && (output.length === outputLength);
  },
  _isValidValue: (value) => {
    let isValid = false;
    for (valueKey in Const.Value) {
      if (Const.Value[valueKey] === value) {
        isValid = true;
        break;
      }
    }
    return isValid;
  },
  _validInputRegExp: new RegExp("^[01]*$"),
}

class AbstractMachine {
  static _generateMachineId() {
    AbstractMachine.currentId++;
    return AbstractMachine.currentId;
  }
  constructor() {
    this.id = AbstractMachine._generateMachineId();
    this.hasAllInputs = false;
  }
  getOutputDimension() {}
  getInputDimension() {}
  getId() {
    return this.toString();
  }
  toString() {
    return new String(this.id);
  }
}
AbstractMachine.currentId = 0;

class SimpleMachine extends AbstractMachine {
  constructor(name, truthTable) {
    if (typeof name !== "string" || !SimpleMachine.nameRegExp.test(name)) {
      throw new Error(Const.ErrorMessage.INVALID_MACHINE_NAME(name))
    }
    if (!truthTableValidator.validate(truthTable)) {
      throw new Error(Const.ErrorMessage.INVALID_TRUTH_TABLE(name));
    }
    super();
    this.name = name;
    this.truthTable = truthTable;
  }
  calculateOutput(inputs) {
    inputs = inputs.map(input => {
      let concatInput;
      if (input === Const.Value.LOW) {
        concatInput = "0";
      }
      if (input === Const.Value.HIGH) {
        concatInput = "1"
      }
      return concatInput;
    });
    inputs = inputs.join("");
    return this.truthTable[inputs];
  }
  getOutputOnPort(inputs, port) {
    return this.calculateOutput(inputs)[port];
  }
  getOutputDimension() {
    return Object.keys(this.truthTable).length > 0
      ? this.truthTable[Object.keys(this.truthTable)[0]].length
      : 0;
  }
  getInputDimension() {
    return Object.keys(this.truthTable).length > 0
      ? Object.keys(this.truthTable)[0].length
      : 0;
  }
  getName() {
    return this.name;
  }
  // Override
  getId() {
    return this.getName();
  }
  // Override
  toString() {
    return this.getName();
  }
}
SimpleMachine.nameRegExp = new RegExp("^[a-zA-Z0-9][-_a-zA-Z0-9]*$");

module.exports = SimpleMachine;
