import assert from 'node:assert';
import { Parser } from '../src/parser.js';
import { readdirSync } from 'node:fs';

const parser = new Parser();

const files = readdirSync(import.meta.url.slice(7, -6)).filter((f) => f.endsWith('test.js'));
const imports = files.map(async (curr) => await import(`./${curr}`));

const exec = () => {
  const program = `
   2 == true && 2 == false;
  `;
  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
};

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

const testRun = async () => {
  for await (const iterator of imports) {
    iterator.default(test);
  }
  console.log('All source tests passed!');
};
exec();
testRun();
