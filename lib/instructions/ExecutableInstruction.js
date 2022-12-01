import Debug from 'debug';

const debug = Debug('twiki:core:instructions:ExecutableInstruction');

export default class ExecutableInstruction {

  #signature;
  #fn;

  constructor({ signature, fn }) {
    this.#signature = signature;
    this.#fn = fn;
  }

  get appellative() {
    return `${this.#signature.appellative}"`;
  }

  async execute(session, step) {
    const args = this.#signature.parse(step);
    await this.#fn.call(session, args);
  }
}
