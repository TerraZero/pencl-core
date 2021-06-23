const Handler = require('pencl-kit/src/Util/Handler');
const Reflection = require('pencl-kit/src/Util/Reflection');

module.exports = class PenclBoot {

  constructor(config = null) {
    this.config = config || {};
    this.handler = new Handler();
    this.definitions = [];
    this.plugins = {};


    process.on('beforeExit', (...args) => {
      this.triggerSync('exit', ...args);
    });
  }

  addConfig(config) {
    for (const index in config) {
      this.config[index] = config[index];
    }
  }

  /**
   * @param {string} name 
   * @param  {...any} args 
   * @returns 
   */
  addPlugin(name, ...args) {
    this.definitions.push({ name, args });
    return this;
  }

  /**
   * @param {string} name 
   * @returns {import('./PenclPlugin')}
   */
  plugin(name) {
    if (this.plugins[name]) {
      this.plugins[name];
    } else {
      for (const definition of this.definitions) {
        if (definition.name === name) {
          this.plugins[name] = require('pencl-' + name)(this, ...definition.args);
          return this.plugins[name];
        }
      }
    }
    return null;
  }

  async boot() {
    for (const plugin of this._loading) {
      try {
        require(plugin.name + '/pencl.hook')(this);
      } catch (e) {}
    }
    await this.trigger('boot', this);
  }

   /**
   * @param {(string|array)} events 
   * @param  {...any} args 
   * @returns {this}
   */
  triggerSync(events, ...args) {
    if (typeof events === 'string') events = [events];
    for (const event of events) {
      this.handler.emit(event, ...args);
    }
    return this;
  }

  /**
   * @param {(string|array)} events 
   * @param  {...any} args 
   * @returns {Promise<this>}
   */
  async trigger(events, ...args) {
    if (typeof events === 'string') events = [events];
    for (const event of events) {
      await (new Promise((resolve) => {
        this.handler.once(event, resolve);
        this.handler.emit(event, ...args);
      }));
    }
    return this;
  }

  /**
   * @param {string} hook
   * @param {import('./PenclPlugin')} plugin 
   * @param {...*} args
   * @returns {Promise<this>}
   */
  async hook(hook, plugin, ...args) {
    return this.trigger([hook + ':' + plugin.name, hook], plugin, ...args);
  }

  /**
   * @param {string} event 
   * @param {function} listener 
   * @returns {this}
   */
  on(event, listener) {
    this.handler.on(event, listener);
    return this;
  }

  /**
   * @param {string} name 
   * @param {(Object|Array|String|Number)} fallback 
   * @returns {(Object|Array|String|Number)}
   */
  getConfig(name, fallback = null) {
    return Reflection.getDeep(this.config, name, fallback);
  }

  /**
   * @param {import('./PenclPlugin')} plugin 
   */
  getPluginConfig(plugin) {
    if (plugin._config_loaded) return plugin.config;
    const config = plugin.config;
    const configs = this.getConfig(plugin.name);

    for (const field in configs) {
      config[field] = configs[field];
    }
    Object.defineProperty(plugin, 'config', {
      value: config,
    });
    plugin._config_loaded = true;
    return config;
  }

}