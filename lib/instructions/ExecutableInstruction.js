import Debug from 'debug';

const debug = Debug('twiki:core:instructions:ExecutableInstruction');

export default class ExecutableInstruction {

  #library;

  #signature;

  #fn;

  constructor({ library, signature, fn }) {
    this.#library = library;
    this.#signature = signature;
    this.#fn = fn;
  }

  get appellative() {
    return `${this.#signature.appellative} defined in "${this.#library.name}"`;
  }

  async execute(session, step) {
    const args = this.#signature.parse(step);
    await this.#fn.call(session, args);
  }
}
