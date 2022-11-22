import Debug from 'debug';

const debug = Debug('twiki:Step');

export default class Step {

  constructor({ text, metadata }) {
    this._text = text;
    this._metadata = metadata;
  }

  get text() {
    return this._text;
  }

  get metadata() {
    return this._metadata;
  }
}
