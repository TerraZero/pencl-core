const PenclBoot = require('./src/Boot/PenclBoot');

/**
 * @export {PenclBoot}
 */
module.exports = function boot(config = null) {
  module.exports = new PenclBoot(config);
  return module.exports;
};