import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Step, Signature } from '../lib/index.js';

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

});
