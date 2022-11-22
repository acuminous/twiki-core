import Debug from 'debug';

const debug = Debug('twiki:ExecutableInstruction');

export default class ExecutableInstruction {

  constructor({ library, signature }) {
    this._library = library;
    this._signature = signature.bind(this);
  }

  get library() {
    return this._library;
  }

  get signature() {
    return this._signature;
  }
}
