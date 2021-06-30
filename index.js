const PenclBoot = require('./src/Boot/PenclBoot');

module.exports = class Booting {

  static get boot() {
    return this._boot;
  }

  static booting(path = null, config = null) {
    if (this._boot === undefined) {
      this._boot = new PenclBoot(path, config);
    }
    return this._boot;
  }

}