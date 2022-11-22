```js
const dictionary = English.dictionary()
  .expression("name", /(\w+)/)
  .docstring("picture");

const library = new Library({ dictionary }).async(
  "$Given a $picture of $name:",
  async (session, picture, name) => {
    // ...
  }
);

const instructions = new InstructionSet().add(library);

const report = new MochaInterpreter({ instructions }).interpret(feature);
```
