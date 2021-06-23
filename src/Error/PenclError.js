module.exports = class PenclError extends Error {

  constructor(message, context = {}) {
    super(message);
    this.context = context;
  }

}