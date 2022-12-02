import Debug from 'debug';
import { ExecutableInstruction } from './instructions/index.js';
import { AsyncFunction } from './functions/index.js';
import Signature from './Signature.js';
import { DuplicateInstructionError, MissingArgumentError } from './Errors.js';

const debug = Debug('twiki:core:Library');

export default class Library {

  #name;
  #instructions = [];

  constructor(props = {}) {
    if (!props.name) throw new MissingArgumentError('Please provide a library name');
    this.#name = props.name;
  }

  get name() {
    return this.#name;
  }

  find(template) {
    return this.#instructions.find((instruction) => instruction.matches(template.toString()));
  }

  search(step) {
    return this.#instructions.filter((instruction) => instruction.supports(step));
  }

  async(template, fn) {
    this.#addAsyncInstruction(template.toString(), this.#deriveRegExp(template), new AsyncFunction({ fn }));
    return this;
  }

  #addAsyncInstruction(template, regexp, fn) {
    if (this.find(template)) throw new DuplicateInstructionError(template, this);
    const signature = new Signature({ library: this, template, regexp });
    const instruction = new ExecutableInstruction({ signature, fn });
    this.#instructions.push(instruction);
    debug(`Added ${instruction.appellative}`);
  }

  #deriveRegExp(template) {
    return template instanceof RegExp ? template : new RegExp(`^${template}$`);
  }
}
