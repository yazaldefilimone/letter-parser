import { Tokenizer, tokenTypes } from './tokenizer.js';

export const ASTTypes = {
  Program: `Program`,
  NumericLiteral: `NumericLiteral`,
  StringLiteral: `StringLiteral`,
  ExpressionStatement: `ExpressionStatement`,
};

export class Parser {
  constructor() {
    this._currentString;
    this._tokenizer = new Tokenizer();
  }
  parse(string) {
    this._tokenizer.init(string);
    this._lookAhead = this._tokenizer.getNextToken();
    this._currentString = string;
    return this.Program();
  }

  /**
   *
   * Main entry point
   * Program
   *  :NumericLiteral
   *  ;
   */
  Program() {
    return {
      type: ASTTypes.Program,
      body: this.StatementList(),
    };
  }
  /**
   *
   * StatementList
   * : StatementList -> Statement StatementList
   * | StringLiteral
   * ;
   */
  StatementList() {
    const nodes = [this.Statement()];
    while (this._lookAhead !== null) {
      nodes.push(this.Statement());
    }
    return nodes;
  }
  Statement() {
    return this.ExpressionStatement();
  }
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(';');
    return {
      type: ASTTypes.ExpressionStatement,
      expression,
    };
  }
  Expression() {
    return this.Literal();
  }
  /**
   *
   * Literal
   * :NumericLiteral
   * |StringLiteral
   * ;
   */

  Literal() {
    switch (this._lookAhead.type) {
      case tokenTypes.NUMBER:
        return this.NumericLiteral();
      case tokenTypes.STRING:
        return this.StringLiteral();
      default:
        throw new SyntaxError('Literal: unexpected literal production');
    }
  }

  /**
   * NumericLiteral
   *  :NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat(tokenTypes.NUMBER);
    return {
      type: ASTTypes.NumericLiteral,
      value: token.value,
    };
  }

  StringLiteral() {
    const token = this._eat(tokenTypes.STRING);
    return {
      type: ASTTypes.StringLiteral,
      value: token.value.slice(1, -1),
    };
  }

  _eat(type) {
    const token = this._lookAhead;
    if (token === null) {
      throw SyntaxError(`Unexpected end of input, expected ${type}`);
    }
    if (token.type !== type) {
      throw SyntaxError(`Unexpected token ${token.type}, expected ${type}`);
    }
    //  advance to next token
    this._lookAhead = this._tokenizer.getNextToken();
    return token;
  }
}
