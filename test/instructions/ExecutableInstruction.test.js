import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Library, Session, Signature, Step, Instructions, Functions } from '../../lib/index.js';

const { ExecutableInstruction } = Instructions;
const { AsyncFunction } = Functions;

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

});

class StubAsyncFunction extends AsyncFunction {

  constructor() {
    super({ fn: (session, ...args) => {
      this.session = session;
      this.args = args;
    } });
  }
}
