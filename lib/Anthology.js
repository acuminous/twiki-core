import Debug from 'debug';
import Library from './Library.js';
import { InvalidArgumentError, DuplicateLibraryError } from './Errors.js';

const debug = Debug('twiki:core:Anthology');

export default class Anthology {

  #libraries = [];

  add(libraries) {
    this.#validateLibraries(libraries);
    this.#libraries = this.#libraries.concat(libraries);
    return this;
  }

  includes(name) {
    return this.#libraries.find((library) => library.name === name);
  }

  #validateLibraries(libraries) {
    [].concat(libraries).forEach((library) => {
      if (!(library instanceof Library)) throw new InvalidArgumentError(`I cannot add ${library} to this anthology because it is not a library`);
      if (this.includes(library.name)) throw new DuplicateLibraryError(library);
    });
  }

  filter(names = this.#libraries.map((library) => library.name)) {
    return new Anthology().add(this.#libraries.filter((library) => names.includes(library.name)));
  }

  select(step) {
    const candidates = this.#libraries.reduce((acc, library) => {
      const instructions = library.search(step);
      return acc.concat(instructions);
    }, []);
    return candidates[0];
  }
}
