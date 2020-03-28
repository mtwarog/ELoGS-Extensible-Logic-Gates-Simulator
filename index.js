const Circuit = require("./modules/circuit");
const Const = require("./modules/const").constants;
const PublicConst = {
  MachineTruthTable: Const.MachineTruthTable,
  Port: Const.Port,
  Value: Const.Value,
}

module.exports = {
  circuit: Circuit,
  constants: PublicConst,
}
