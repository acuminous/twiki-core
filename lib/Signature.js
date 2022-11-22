import Debug from 'debug';

const debug = Debug('twiki:Signature');

export default class Signature {

  constructor({ regexp }) {
    this._regexp = regexp;
  }

  supports(step) {
    const result = this._regexp.test(step.text);
    debug(`Testing "${step.text}" using ${this._regexp}: ${result}`);
    return result;
  }

  precludes(other) {
    const result = this._regexp.source === other._regexp.source;
    debug(`Checking whether "${this._regexp}" precludes ${other._regexp}: ${result}`);
    return result;
  }

}
