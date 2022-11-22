import Debug from 'debug';

const debug = Debug('twiki:functions:AsyncFunction');

export default class AsyncFunction {

  constructor({ fn }) {
    this._fn = fn;
    this._name = fn.name || 'anonymous';
  }

  async run(session, args) {
    debug(`Calling "${this._name}" function with session and ${args.length} arguments`);
    await this._fn(session, ...args);
  }

}
