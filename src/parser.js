import { Tokenizer, tokensEnum } from './tokenizer.js';

export const ASTTypes = {
  Program: `Program`,
  NumericLiteral: `NumericLiteral`,
  StringLiteral: `StringLiteral`,
  ExpressionStatement: `ExpressionStatement`,
  BlockStatement: `BlockStatement`,
  EmptyStatement: `EmptyStatement`,
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
  StatementList(stopLookToken = null) {
    const nodes = [this.Statement()];
    while (this._lookAhead !== null && this._lookAhead.type !== stopLookToken) {
      nodes.push(this.Statement());
    }
    return nodes;
  }
  /**
   *
   * Statement
   * : ExpressionStatement
   * | BlockStatement
   * | EmptyStatement
   * ;
   */
  Statement() {
    switch (this._lookAhead.type) {
      case tokensEnum.SEMICOLON:
        return this.EmptyStatement();
      case tokensEnum.LEFT_BRACE:
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.ExpressionStatement,
      expression,
    };
  }

  BlockStatement() {
    this._eat(tokensEnum.LEFT_BRACE);

    let body;
    if (this._lookAhead.type !== tokensEnum.RIGHT_BRACE) {
      body = this.StatementList(tokensEnum.RIGHT_BRACE);
    } else {
      body = [];
    }

    this._eat(tokensEnum.RIGHT_BRACE);
    return {
      type: ASTTypes.BlockStatement,
      body,
    };
  }
  Expression() {
    return this.Literal();
  }
  EmptyStatement() {
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.EmptyStatement,
    };
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
      case tokensEnum.NUMBER:
        return this.NumericLiteral();
      case tokensEnum.STRING:
        return this.StringLiteral();
      default:
        throw new SyntaxError('Literal: unexpected literal production, receive ' + this._lookAhead.type);
    }
  }

  /**
   * NumericLiteral
   *  :NUMBER
   *  ;
   */
  NumericLiteral() {
    const token = this._eat(tokensEnum.NUMBER);
    return {
      type: ASTTypes.NumericLiteral,
      value: token.value,
    };
  }

  StringLiteral() {
    const token = this._eat(tokensEnum.STRING);
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
