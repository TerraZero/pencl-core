const PenclBoot = require('./src/Boot/PenclBoot');

module.exports = class Booter {

  /** @returns {PenclBoot} */
  static get boot() {
    return this._boot;
  }

  /**
   * @param {object} config 
   * @returns {PenclBoot}
   */
  static booting(config) {
    this._boot = new PenclBoot(config);
    return this._boot;
  }

}