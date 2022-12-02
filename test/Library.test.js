import { setTimeout } from 'timers/promises';
import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Library, Session, Step } from '../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Library', () => {

  it('should require a name', () => {
    throws(() => new Library(), (err) => {
      eq(err.code, 'twiki-core/general/001', err);
      eq(err.message, 'Please provide a library name');
      return true;
    });
  });

  it('should define an async instruction from a string template', async () => {
    const library = new Library({ name: 'Season One' })
      .async('Good luck Buck!', () => setTimeout(100));

    const instruction = library.find('Good luck Buck!');
    ok(instruction);
    eq(instruction.appellative, '"Good luck Buck!" defined in the "Season One" library');

    const timeBefore = Date.now();
    const step = new Step({ text: 'Good luck Buck!' });
    await instruction.execute(new Session(), step);
    const timeAfter = Date.now();

    ok(timeAfter >= timeBefore + 100, 'Did not define an async instruction');
  });

  it('should define an async instruction from a regexp template', async () => {
    const library = new Library({ name: 'Season One' })
      .async(/Good luck Buck!/, () => setTimeout(100));

    const instruction = library.find(/Good luck Buck!/);
    ok(instruction);
    eq(instruction.appellative, '/Good luck Buck!/ defined in the "Season One" library');

    const timeBefore = Date.now();
    const step = new Step({ text: 'Good luck Buck!' });
    await instruction.execute(new Session(), step);
    const timeAfter = Date.now();

    ok(timeAfter >= timeBefore + 100, 'Did not define an async instruction');
  });

  it('should report instructions from a duplicate string template', async () => {
    const library = new Library({ name: 'Season One' })
      .async('Good luck Buck!');

    throws(() => library.async('Good luck Buck!'), (err) => {
      eq(err.code, 'twiki-core/library/001');
      eq(err.message, 'There is already an instruction with signature Good luck Buck! defined in the "Season One" library');
      return true;
    });
  });

  it('should report instructions from a duplicate regexp template', async () => {
    const library = new Library({ name: 'Season One' })
      .async(/Good luck Buck!/);

    throws(() => library.async(/Good luck Buck!/), (err) => {
      eq(err.code, 'twiki-core/library/001', err);
      eq(err.message, 'There is already an instruction with signature /Good luck Buck!/ defined in the "Season One" library');
      return true;
    });
  });

  it('should search for compatible instructions', () => {
    const library = new Library({ name: 'Season One' })
      .async(/Good luck Buck!/)
      .async(/Good luck Wilma!/)
      .async(/Good luck (\w+)!/);

    const step = new Step({ text: 'Good luck Buck!' });
    const instructions = library.search(step);

    eq(instructions.length, 2);
    ok(instructions.find((instruction) => instruction.appellative === '/Good luck Buck!/ defined in the "Season One" library'));
    ok(instructions.find((instruction) => instruction.appellative === '/Good luck (\\w+)!/ defined in the "Season One" library'));
  });
});
