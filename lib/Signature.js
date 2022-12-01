import Debug from 'debug';

import { IncompatibleInstructionBug } from './Errors.js';

const debug = Debug('twiki:core:Signature');

export default class Signature {

  #template;

  #regexp;

  #instruction;

  constructor({ template, regexp }) {
    this.#template = template;
    this.#regexp = regexp;
  }

  get appellative() {
    return `"${this.#template}"`;
  }

  bind(instruction) {
    this.#instruction = instruction;
  }

  supports(step) {
    const result = this.#regexp.test(step.text);
    debug(`Testing "${step.text}" using ${this.#regexp}: ${result}`);
    return result;
  }

  precludes(other) {
    const result = this.#regexp.source === other.#regexp.source;
    debug(`Checking whether ${this.#regexp} precludes ${other.#regexp}: ${result}`);
    return result;
  }

  parse(step) {
    const match = this.#regexp.exec(step.text);
    if (!match) throw new IncompatibleInstructionBug(this.#instruction, step);

    const [, ...result] = match;
    debug(`Parsed "${step.text}" using ${this.#regexp}: [${result.join(', ')}]`);
    return result;
  }
}
