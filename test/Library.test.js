import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Library, Session, Step } from '../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Library', () => {

  it('should define an async instruction with a string template', async () => {
    let called = false;

    const library = new Library({ name: 'Some Library' });
    library.async('Good luck Buck!', () => {
      called = true;
    });

    const instruction = library.find('Good luck Buck!');
    ok(instruction);

    const step = new Step({ text: 'Good luck Buck!' });
    await instruction.execute(new Session(), step);

    eq(called, true);
  });

  it('should define an async instruction with a regexp template', async () => {
    let called = false;

    const library = new Library({ name: 'Some Library' });
    library.async(/^Good luck Buck!$/, () => {
      called = true;
    });

    const instruction = library.find('/^Good luck Buck!$/');
    ok(instruction);

    const step = new Step({ text: 'Good luck Buck!' });
    await instruction.execute(new Session(), step);

    eq(called, true);
  });

  it('should report instructions with a duplicate string template', async () => {
    const library = new Library({ name: 'Searcher' });

    library.async('Good luck Buck!');
    throws(() => library.async('Good luck Buck!'), (err) => {
      eq(err.code, 'twiki-core/library/001');
      eq(err.message, 'There is already an instruction with signature Good luck Buck! defined in the "Searcher" library');
      return true;
    });
  });

  it('should report instructions with a duplicate regexp template', async () => {
    const library = new Library({ name: 'Searcher' });

    library.async(/Good luck Buck!/);
    throws(() => library.async(/Good luck Buck!/), (err) => {
      eq(err.code, 'twiki-core/library/001', err);
      eq(err.message, 'There is already an instruction with signature /Good luck Buck!/ defined in the "Searcher" library');
      return true;
    });
  });
});
