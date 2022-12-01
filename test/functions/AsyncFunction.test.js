import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Session, Functions } from '../../lib/index.js';

const { AsyncFunction } = Functions;

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('AsyncFunction', () => {

  it('should wait until the underlying function completes', async () => {
    const underlying = async () => new Promise((resolve) => setTimeout(resolve, 100));

    const fn = new AsyncFunction({ fn: underlying });
    const session = new Session();

    const timeBefore = Date.now();
    await fn.call(session, []);
    const timeAfter = Date.now();

    ok(timeAfter >= timeBefore + 100, 'Did not wait for underlying function to complete');
  });

  it('should call the underlying function with destructured arguments', async () => {
    const underlying = async (session, ...args) => {
      eq(args.length, 3);
      eq(args[0], 1);
      eq(args[1], 2);
      eq(args[2], 3);
    };

    const fn = new AsyncFunction({ fn: underlying });
    const session = new Session();

    await fn.call(session, [1, 2, 3]);
  });

});
