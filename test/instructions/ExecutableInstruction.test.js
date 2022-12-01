import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Library, Session, Signature, Step, Instructions } from '../../lib/index.js';
import StubAsyncFunction from '../stubs/StubAsyncFunction.js';

const { ExecutableInstruction } = Instructions;

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('ExecutableInstruction', () => {

  it('should call the underlying function with no arguments', async () => {
    const library = new Library({ name: 'Some Library' });
    const signature = new Signature({ library, template: 'Good luck Buck!', regexp: /^Good luck Buck!$/ });
    const fn = new StubAsyncFunction();
    const instruction = new ExecutableInstruction({ signature, fn });

    const session = new Session();
    const step = new Step({ text: 'Good luck Buck!' });

    await instruction.execute(session, step);

    eq(fn.session, session);
    eq(fn.args.length, 0);
  });

  it('should call the underlying function with parsed arguments', async () => {
    const library = new Library({ name: 'Some Library' });
    const signature = new Signature({ library, template: 'Good luck Buck!', regexp: /^Good luck (\w+)!$/ });
    const fn = new StubAsyncFunction();
    const instruction = new ExecutableInstruction({ signature, fn });

    const session = new Session();
    const step = new Step({ text: 'Good luck Buck!' });

    await instruction.execute(session, step);

    eq(fn.session, session);
    eq(fn.args.length, 1);
    eq(fn.args[0], 'Buck');
  });

  it('should wait for the underlying function to yield', async () => {
    const library = new Library({ name: 'Some Library' });
    const signature = new Signature({ library, template: 'Good luck Buck!', regexp: /^Good luck Buck!$/ });
    const fn = new StubAsyncFunction({ delay: 100 });
    const instruction = new ExecutableInstruction({ signature, fn });

    const session = new Session();
    const step = new Step({ text: 'Good luck Buck!' });

    const timeBefore = Date.now();
    await instruction.execute(session, step);
    const timeAfter = Date.now();

    ok(timeAfter >= timeBefore + 100);
  });
});
