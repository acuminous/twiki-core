import Debug from 'debug';

const debug = Debug('twiki:ExecutableInstruction');

export default class ExecutableInstruction {

  constructor({ library, signature }) {
    this._library = library;
    this._signature = signature;
  }

  get appellative() {
    return `${this._signature.appellative} defined in "${this._library.name}"`;
  }

  get library() {
    return this._library;
  }
}
