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
    return `${this.#signature.appellative}`;
  }

  matches(template) {
    return this.#signature.matches(template);
  }

  supports(step) {
    return this.#signature.supports(step);
  }

  async execute(session, step) {
    const args = this.#signature.parse(step);
    await this.#fn.call(session, args);
  }
}
