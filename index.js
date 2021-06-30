const PenclBoot = require('./src/Boot/PenclBoot');

class Booting {

  get boot() {
    return this._boot;
  }

  booting(path = null, config = null) {
    if (this._boot === undefined) {
      this._boot = new PenclBoot(path, config);
    }
    return this._boot;
  }

}

module.exports = function() {
  if (this._pencl_core === undefined) {
    this._pencl_core = new Booting();
  }
  return this._pencl_core;
}