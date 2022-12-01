import Debug from 'debug';

const debug = Debug('twiki:functions:AsyncFunction');

export default class AsyncFunction {

  #fn;

  constructor({ fn }) {
    this.#fn = fn;
  }

  async call(session, args) {
    debug(`Calling ${this.#fn.name ? `"${this.#fn.name}"` : 'anonymous'} function with session and ${args.length} arguments`);
    await this.#fn(session, ...args);
  }

}
