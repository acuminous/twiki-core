import Debug from 'debug';

import { IncompatibleInstructionBug } from './Errors.js';

const debug = Debug('twiki:Signature');

export default class Signature {

  constructor({ template, regexp }) {
    this._template = template;
    this._regexp = regexp;
  }

  get appellative() {
    return `"${this._template}"`;
  }

  bind(instruction) {
    this._instruction = instruction;
  }

  supports(step) {
    const result = this._regexp.test(step.text);
    debug(`Testing "${step.text}" using ${this._regexp}: ${result}`);
    return result;
  }

  precludes(other) {
    const result = this._regexp.source === other._regexp.source;
    debug(`Checking whether ${this._regexp} precludes ${other._regexp}: ${result}`);
    return result;
  }

  parse(step) {
    const match = this._regexp.exec(step.text);
    if (!match) throw new IncompatibleInstructionBug(this._instruction, step);

    const [, ...result] = match;
    debug(`Executing ${this._regexp} with "${step.text}": [${result.join(', ')}]`);
    return result;
  }
}
