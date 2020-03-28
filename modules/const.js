const ErrorMessage = {
  INVALID_MACHINE_NAME: (name) => `Invalid machine name: ${name}`,
  MISSING_INPUT: "Machine has missing inputs",
  ABSTRACT_CLASS_INSTRANTIATION: "Abstract classes cannot be instantiated",
  STATE_HISTORY_EMPTY: "State history is empty",
  DUPLICATE_MACHINE: (name) => `Machine already exists: ${name}`,
  CONNECTION_DOESNT_EXIST: (outMachineId, outPort, inMachineId, inPort) =>
    `Connection from machine ${outMachineId}, port ${outPort} to machine ${inMachineId}, port ${inPort} doesn't exist`,
  NON_EXISTENT_MACHINE: (machineId) => `Machine doesn't exist: ${machineId}`,
  PORT_OUT_OF_RANGE: (isOutPort, machineId, port, machinePortDimension) =>
    `${isOutPort ? "Output" : "Input"} port ${port} is out of range in machine ${machineId}. Number of ${isOutPort ? "Output" : "Input"} ports in machine: ${machinePortDimension}.`,
  INVALID_TRUTH_TABLE: (machineName) => `Truth table for machine ${machineName} is invalid`,
  NOT_MACHINE: (inMachine) => `${inMachine} is not a machine`,
  NOT_PORT: (port) => `${port} is not a port`,
  NOT_STATE: (state) => `${state} is not a state`,
  MACHINE_NOT_IN_STATE: (machine) => `${machine} not present in state`,
};

const EMPTY_INPUTS = [];

const Value = {
  LOW: false,
  HIGH: true,
  UNDEFINED: undefined,
  DISCONNECTED: null
};

const MachineTruthTable = {
  NOT: {"0": [Value.HIGH], "1": [Value.LOW]},
  AND: {"00": [Value.LOW], "01": [Value.LOW], "10": [Value.LOW], "11": [Value.HIGH]},
  NAND: {"00": [Value.HIGH], "01": [Value.HIGH], "10": [Value.HIGH], "11": [Value.LOW]},
  OR: {"00": [Value.LOW], "01": [Value.HIGH], "10": [Value.HIGH], "11": [Value.HIGH]},
  NOR: {"00": [Value.HIGH], "01": [Value.LOW], "10": [Value.LOW], "11": [Value.LOW]},
  XOR: {"00": [Value.LOW], "01": [Value.HIGH], "10": [Value.HIGH], "11": [Value.LOW]},
  ON: {"": [Value.HIGH]},
  OFF: {"": [Value.LOW]}
}

const Port = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
}

module.exports.constants = {
  ErrorMessage,
  Value,
  MachineTruthTable,
  EMPTY_INPUTS,
  Port,
}

module.exports.initializer = (context) => {
  context.ErrorMessage = ErrorMessage;
  context.Value = Value;
  context.MachineTruthTable = MachineTruthTable;
  context.EMPTY_INPUTS = EMPTY_INPUTS;
  context.Port = Port;
}
