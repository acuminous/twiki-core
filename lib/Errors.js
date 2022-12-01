/* eslint max-classes-per-file: 0, no-unused-vars: 0 */

import Package from './Package.js';

class TwikiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

class TwikiBug extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please submit a bug report via ${Package.issues}`, code);
  }
}

class TwikiPullRequest extends TwikiError {
  constructor(message, code) {
    super(`${message} - Please submit a pull request via ${Package.pulls}`, code);
  }
}

export class IncompatibleSignatureBug extends TwikiBug {
  static code = `${Package.name}/instruction/001`;

  constructor(signature, step) {
    const message = `I attempted to execute an incompatible instruction ${signature.appellative} when interpretting the step ${step.appellative}`;
    super(message, IncompatibleSignatureBug.code);
  }
}

export class DuplicateInstructionError extends TwikiError {
  static code = `${Package.name}/library/001`;

  constructor(template, library) {
    const message = `There is already an instruction with signature ${formatTemplate(template)} defined in the "${library.name}" library`;
    super(message, DuplicateInstructionError.code);
  }
}

function formatTemplate(template) {
  return template.match(/^\/.+\/$/) ? template : `${template}`;
}
