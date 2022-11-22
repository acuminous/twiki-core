import Debug from 'debug';

const debug = Debug('twiki:functions:AsyncFunction');

export default class AsyncFunction {

  constructor({ fn }) {
    this._fn = fn;
  }

  async run(session, args) {
    debug(`Calling ${this._fn.name ? `"${this._fn.name}"` : 'anonymous'} function with session and ${args.length} arguments`);
    await this._fn(session, ...args);
  }

}
