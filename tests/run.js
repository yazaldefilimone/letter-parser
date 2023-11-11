import { Parser } from "../src/parser.js";


const parser = new Parser();


const program = `   
/**
 * 
 * 
 *  String
 **/

100`;



const ast = parser.parse(program);


console.log(JSON.stringify(ast, null, 2))