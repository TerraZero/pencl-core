const Core = require('pencl-core').boot;
const Reflection = require('pencl-kit/src/Util/Reflection');

module.exports = class PenclPlugin {

  get LOG_DEBUG() {return 1;};
  get LOG_NOTICE() {return 2;};
  get LOG_WARNING() {return 3;};
  get LOG_ERROR() {return 4;};

  /**
   * @param {import('./PenclBoot')} boot 
   */
  constructor() {
    this._config_loaded = false;

    Core.getPluginConfig(this);
    Core.triggerSync(['init:' + this.name, 'init'], this);
  }

  /**
   * @abstract
   * @returns {object} 
   */
  get config() {
    return {};
  }

  /** 
   * @abstract
   * @returns {string} 
   */
  get name() {
    return this.constructor.name;
  }

  /** @returns {boolean} */
  get debug() {
    return this.pencl.debug || this.config.debug || false;
  }

  /** @returns {number} */
  get logLevel() {
    return this.pencl.log_level || this.config.log_level || 2;
  }

  /**
   * @param {string} name 
   * @param  {...any} args 
   */
  async hook(name, ...args) {
    await Core.hook(name, this, ...args);
  }

  /**
   * @param {string} message 
   * @param {(object|Array)} placeholders 
   * @param {string} type 
   * @param {boolean} trigger
   */
  log(message, placeholders = {}, type = PenclPlugin.LOG_NOTICE, trigger = true) {
    const statement = Reflection.replaceMessage(message, placeholders, '"');
    if (this.debug || type >= this.logLevel) {
      let readable_type = null;
      switch (type) {
        case PenclPlugin.LOG_DEBUG: 
          readable_type = 'DEBUG';
          break;
        case PenclPlugin.LOG_NOTICE: 
          readable_type = 'NOTICE';
          break;
        case PenclPlugin.LOG_WARNING: 
          readable_type = 'WARNING';
          break;
        case PenclPlugin.LOG_ERROR: 
          readable_type = 'ERROR';
          break;
        default:
          readable_type: '';
          break;
      }
      console.log('[' + readable_type + ']: ' + statement);
    }
    if (save) {
      this.hook('logging', {
        type,
        statement,
        readable_type,
        message,
        placeholders,
      });
    }
  }

}