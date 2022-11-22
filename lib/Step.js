import Debug from 'debug';

const debug = Debug('twiki:Step');

export default class Step {

  constructor({ text }) {
    this._text = text;
  }

  get text() {
    return this._text;
  }
}