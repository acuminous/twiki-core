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
  static code = `${Package.name}/signature/001`;

  constructor(step, instruction) {
    const message = `I attempted to parse the step "${step.text}" from ${step.metadata?.source?.uri}:${step.metadata?.source?.lineNumber} using an instruction with an incompatible signature "${instruction.signature.template}" defined in "${instruction.library.name}"`;
    super(message, IncompatibleSignatureBug.code);
  }
}
