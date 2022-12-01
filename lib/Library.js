import Debug from 'debug';

const debug = Debug('twiki:core:Library');

export default class Library {
  constructor({ name }) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}
