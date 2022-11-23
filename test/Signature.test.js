import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Step, Library, Signature, Instructions, Errors } from '../lib/index.js';

const { ExecutableInstruction } = Instructions;
const { IncompatibleInstructionBug } = Errors;

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Signature', () => {

  it('should support compatible steps', () => {
    const step = new Step({ text: 'Good luck Buck!' });
    const signature = new Signature({ regexp: /^Good luck Buck!$/ });

    ok(signature.supports(step));
  });

  it('should not support incompatible steps', () => {
    const step = new Step({ text: 'Good luck Buck!' });
    const signature = new Signature({ regexp: /^Good luck Wilma!$/ });

    ok(!signature.supports(step));
  });

  it('should preclude signatures with identical regular expressions', () => {
    const signature1 = new Signature({ regexp: /^Good luck Buck!$/ });
    const signature2 = new Signature({ regexp: /^Good luck Buck!$/ });

    ok(signature1.precludes(signature2));
  });

  it('should not preclude signatures with differing regular expressions', () => {
    const signature1 = new Signature({ regexp: /^Good luck Buck!$/ });
    const signature2 = new Signature({ regexp: /^Good luck Wilma!$/ });

    ok(!signature1.precludes(signature2));
  });

  it('should parse step text when there are no matching groups', () => {
    const step = new Step({ text: 'Good luck Buck!' });
    const signature = new Signature({ regexp: /^Good luck Buck!$/ });

    const args = signature.parse(step);

    eq(args.length, 0);
  });

  it('should parse step text when there are matching groups', () => {
    const step = new Step({ text: 'Good luck Buck Rogers!' });
    const signature = new Signature({ regexp: /^Good luck (\w+) (\w+)!$/ });

    const args = signature.parse(step);

    eq(args.length, 2);
    eq(args[0], 'Buck');
    eq(args[1], 'Rogers');
  });

  it('should report a bug if the regular expression does not match the step text', () => {
    const step = new Step({ text: 'Good luck Buck!', metadata: { source: { uri: 'buck-rogers.feature', lineNumber: 12 } } });
    const library = new Library({ name: 'Some Library' });
    const signature = new Signature({ template: 'Good luck ${firstName} ${lastName}!', regexp: /^Good luck (\w+) (\w+)!$/ });
    const instruction = new ExecutableInstruction({ library, signature });
    signature.bind(instruction);

    throws(() => signature.parse(step), (err) => {
      eq(err.code, IncompatibleInstructionBug.code, err.stack);
      eq(err.message, 'I attempted to execute an incompatible instruction "Good luck ${firstName} ${lastName}!" defined in "Some Library" when interpretting the step "Good luck Buck!" at buck-rogers.feature:12 - Please submit a bug report via https://github.com/acuminous/twiki-core/issues');
      return true;
    });
  });
});
