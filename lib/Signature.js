import Debug from 'debug';

import { IncompatibleSignatureBug } from './Errors.js';

const debug = Debug('twiki:core:Signature');

export default class Signature {

  #library;
  #template;
  #regexp;

  constructor({ library, template, regexp }) {
    this.#library = library;
    this.#template = template;
    this.#regexp = regexp;
  }

  get appellative() {
    const quoted = this.#template.match(/^\/.+\/$/) ? this.#template : `"${this.#template}"`;
    return `${quoted} defined in the "${this.#library.name}" library`;
  }

  matches(template) {
    return this.#template === template;
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
    if (!match) throw new IncompatibleSignatureBug(this, step);

    const [, ...result] = match;
    debug(`Parsed "${step.text}" using ${this.#regexp}: [${result.join(', ')}]`);
    return result;
  }
}
