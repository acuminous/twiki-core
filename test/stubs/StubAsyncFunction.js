import { setTimeout } from 'timers/promises';
import { AsyncFunction } from '../../lib/functions/index.js';

export default class StubAsyncFunction extends AsyncFunction {

  constructor(options = {}) {
    const delay = options.delay || 0;
    super({ fn: async (session, ...args) => {
      this.session = session;
      this.args = args;
      return setTimeout(delay);
    } });
  }
}
