const Const = require("./const").constants;

class Connection {
  constructor(outMachine, outPort,  inMachine, inPort) {
    this._throwIfConnectionInvalid(outMachine, outPort,  inMachine, inPort);

    this.connectionToInput = new ConnectionToInput(inMachine, inPort);
    this.connectionToOutput = new ConnectionToOutput(outMachine, outPort);
  }
  _throwIfConnectionInvalid(outMachine, outPort,  inMachine, inPort) {
    if (!(outMachine instanceof Object)) {
      throw new Error(Const.ErrorMessage.NOT_MACHINE(outMachine));
    }
    if (!(inMachine instanceof Object)) {
      throw new Error(Const.ErrorMessage.NOT_MACHINE(inMachine));
    }
    if (typeof outPort !== "number") {
      throw new Error(Const.ErrorMessage.NOT_PORT(outPort));
    }
    if (typeof inPort !== "number") {
      throw new Error(Const.ErrorMessage.NOT_PORT(inPort));
    }
  }
  getOutMachine() {
    return this.connectionToOutput.getOutMachine();
  }
  getOutPort() {
    return this.connectionToOutput.getOutPort();
  }
  getInMachine() {
    return this.connectionToInput.getInMachine();
  }
  getInPort() {
    return this.connectionToInput.getInPort();
  }
  getConnectionToInput() {
    return this.connectionToInput;
  }
  getConnectionToOutput() {
    return this.connectionToOutput;
  }
}

class ConnectionToInput {
  constructor(inMachine, inPort) {
    this.inMachine = inMachine;
    this.inPort = inPort;
  }
  getInMachine() {
    return this.inMachine;
  }
  getInPort() {
    return this.inPort;
  }
}

class ConnectionToOutput {
  constructor(outMachine, outPort) {
    this.outMachine = outMachine;
    this.outPort = outPort;
  }
  getOutMachine() {
    return this.outMachine;
  }
  getOutPort() {
    return this.outPort;
  }
}

module.exports = Connection;
