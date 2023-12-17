import assert from 'node:assert';
import { Parser } from '../src/parser.js';
import { readdirSync } from 'node:fs';

const parser = new Parser();

const files = readdirSync(import.meta.url.slice(7, -6)).filter((f) => f.endsWith('test.js'));
const imports = files.map(async (curr) => await import(`./${curr}`));

const exec = () => {
  const program = `
   class Point {
    def constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    def calc() {
      return this.x + this.y;
    }
   }

  //  class Point3D extends Point {
  //   def constructor(x, y, z) {
  //     super(x, y);
  //     this.z = z;
  //   }
  //  }
    // let p3d = new Point3D(10, 20, 30);
    // p3d.calc();
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
};

exec();
testRun();
console.log('All source tests passed!');
