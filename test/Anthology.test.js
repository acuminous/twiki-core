import { strictEqual as eq, deepStrictEqual as deq, throws, ok, fail } from 'node:assert';
import zunit from 'zunit';
import { Anthology, Library } from '../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;

describe('Anthology', () => {

  describe('add', () => {
    it('should reject duplicate libraries', () => {
      const library1 = new Library({ name: 'Season One' });
      const library2 = new Library({ name: 'Season One' });

      const anthology = new Anthology()
        .add(library1);

      throws(() => anthology.add(library2), (err) => {
        eq(err.code, 'twiki-core/anthology/001', err);
        eq(err.message, 'There is already a library called "Season One" in this anthology');
        return true;
      });
    });

    it('should reject invalid libraries', () => {
      throws(() => new Anthology().add(undefined), (err) => {
        eq(err.code, 'twiki-core/general/002', err);
        eq(err.message, 'I cannot add undefined to this anthology because it is not a library');
        return true;
      });
    });
  });

  describe('filter', () => {
    it('should not filter libraries when no names are specified', async () => {
      const library1 = new Library({ name: 'Season One' })
        .async(/Good luck Buck!/);

      const library2 = new Library({ name: 'Season Two' })
        .async(/Good luck Wilma!/);

      const anthology = new Anthology()
        .add(library1)
        .add(library2);

      const filtered = anthology.filter();

      ok(filtered.includes('Season One'));
      ok(filtered.includes('Season Two'));
    });

    it('should filter libraries when names are specified', async () => {
      const library1 = new Library({ name: 'Season One' })
        .async(/Good luck Buck!/);

      const library2 = new Library({ name: 'Season Two' })
        .async(/Good luck Wilma!/);

      const anthology = new Anthology()
        .add(library1)
        .add(library2);

      const filtered = anthology.filter(['Season Two']);

      ok(!(filtered.includes('Season One')));
      ok(filtered.includes('Season Two'));
    });
  });
});
