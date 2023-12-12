import { Tokenizer, tokensEnum } from './tokenizer.js';

export const ASTTypes = {
  Program: `Program`,
  NumericLiteral: `NumericLiteral`,
  StringLiteral: `StringLiteral`,
  ExpressionStatement: `ExpressionStatement`,
  BlockStatement: `BlockStatement`,
  EmptyStatement: `EmptyStatement`,
  BinaryExpression: `BinaryExpression`,
  AssignmentExpression: `AssignmentExpression`,
  Identifier: `Identifier`,
  IfStatement: `IfStatement`,
  VariableStatement: `VariableStatement`,
  VariableDeclaration: `VariableDeclaration`,
  VariableDeclarator: `VariableDeclarator`,
  BinaryExpression: `BinaryExpression`,
  BooleanLiteral: `BooleanLiteral`,
  NullLiteral: `NullLiteral`,
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
      case tokensEnum.LET:
        return this.VariableStatement();
      case tokensEnum.IF:
        return this.IfStatement();
      default:
        return this.ExpressionStatement();
    }
  }
  /*
    * IfStatement
    * : IF ParenthesizedExpression Statement ElseStatement
    * ;
    /
  IfStatement() {
    const ifKeyword = this._eat(tokensEnum.IF);
    const test = this.ParenthesizedExpression();
    const consequent = this.Statement();
    let alternate = this.ElseStatement();
    return {
      type: ASTTypes.IfStatement,
      test,
      consequent,
      alternate,
    };
  }
  /*
   * ElseStatement
   * : ELSE Statement
   * | IfStatement
   * ;
   */
  ElseStatement() {
    if (this._lookAhead.type !== tokensEnum.ELSE) {
      return null;
    }
    const elseKeyword = this._eat(tokensEnum.ELSE);
    const statement = this.Statement();
    return statement;
  }
  /*
   * VariableStatement
   * : LET VariableDeclarationList SEMICOLON
   * ;
   */
  VariableStatement() {
    const letKeyword = this._eat(tokensEnum.LET);
    const declarations = this.VariableDeclarationList();
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.VariableStatement,
      declarations,
    };
  }
  /*
   * VariableDeclarationList
   * : VariableDeclarationList COMMA VariableDeclaration
   * | VariableDeclaration
   * ;
   */
  VariableDeclarationList() {
    const declarations = [this.VariableDeclaration()];
    while (this._lookAhead.type === tokensEnum.COMMA) {
      this._eat(tokensEnum.COMMA);
      declarations.push(this.VariableDeclaration());
    }
    return declarations;
  }
  /*
   * VariableDeclaration
   * : Identifier
   * | Identifier SIMPLE_ASSIGNMENT AssignmentExpression
   * ;
   */
  VariableDeclaration() {
    const id = this.Identifier();
    let init = null;
    if (this._lookAhead.type === tokensEnum.SIMPLE_ASSIGNMENT) {
      init = this.VariableInitializer();
    }
    // if (this._lookAhead.type !== tokensEnum.COMMA && this._lookAhead.type !== tokensEnum.SEMICOLON) {
    //   init = this.VariableInitializer();
    // }
    return {
      type: ASTTypes.VariableDeclaration,
      id,
      init,
    };
  }
  /*
   * VariableInitializer
   * : SIMPLE_ASSIGNMENT AssignmentExpression
   * ;
   */
  VariableInitializer() {
    this._eat(tokensEnum.SIMPLE_ASSIGNMENT);
    return this.AssignmentExpression();
  }
  /*
   * AssignmentExpression
   * : LeftHandSideExpression AssignmentOperator AssignmentExpression
   * | EqualityExpression
   * ;
   */
  AssignmentExpression() {
    const leftToken = this.EqualityExpression();
    if (!this._isAssignmentOperator(this._lookAhead.type)) {
      return leftToken;
    }
    const operator = this.AssignmentOperator().value;

    const rightToken = this.AssignmentExpression();

    return {
      type: ASTTypes.AssignmentExpression,
      left: this._checkLeftAssignment(leftToken),
      operator,
      right: rightToken,
    };
  }
  /*
   * EqualityExpression
   * : RelationalExpression
   * | EqualityExpression EQUALITY_OPERATOR RelationalExpression ( <, >, <=, >=)
   * ;
   */
  RelationalExpression() {
    return this._BinaryExpression('AdditiveExpression', tokensEnum.RELATIONAL_OPERATOR);
  }
  /*
   * AssignmentOperator
   * : SIMPLE_ASSIGNMENT
   * | COMPLEX_ASSIGNMENT
   * | RELATIONAL_OPERATOR
   * ;
   */
  AssignmentOperator() {
    if (this._lookAhead.type === tokensEnum.COMPLEX_ASSIGNMENT) {
      return this._eat(tokensEnum.COMPLEX_ASSIGNMENT);
    }
    if (this._lookAhead.type === tokensEnum.RELATIONAL_OPERATOR) {
      return this._eat(tokensEnum.RELATIONAL_OPERATOR);
    }
    return this._eat(tokensEnum.SIMPLE_ASSIGNMENT);
  }
  /*
   * LeftHandSideExpression
   * : Identifier
   * ;
   */

  LeftHandSideExpression() {
    return this.Identifier();
  }
  /*
   * ExpressionStatement
   * : Expression SEMICOLON
   * ;
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.ExpressionStatement,
      expression,
    };
  }
  /*
   * BlockStatement
   * : LEFT_BRACE StatementList RIGHT_BRACE
   * ;
   */
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
  /*
   * Expression
   * : AssignmentExpression
   * ;
   */
  Expression() {
    return this.AssignmentExpression();
  }
  /*
    * EmptyStatement
    * : SEMICOLON
    * ;
  EmptyStatement() {
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.EmptyStatement,
    };
  }
  /*
   * EqualityExpression
   * : RelationalExpression
   * | EqualityExpression EQUALITY_OPERATOR RelationalExpression
   * ;
   * */

  EqualityExpression() {
    return this._BinaryExpression('RelationalExpression', tokensEnum.EQUALITY_OPERATOR);
  }
  /*
   * AdditiveExpression
   * : MultiplicativeExpression
   * | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
   * ;
   */
  AdditiveExpression() {
    return this._BinaryExpression('MultiplicativeExpression', tokensEnum.ADDITIVE_OPERATOR);
  }
  /*
   * MultiplicativeExpression
   * : PrimaryExpression
   * | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
   * ;
   */
  MultiplicativeExpression() {
    return this._BinaryExpression('PrimaryExpression', tokensEnum.MULTIPLICATIVE_OPERATOR);
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
      case tokensEnum.NULL:
        return this.NullLiteral();
      case tokensEnum.TRUE:
        return this.BooleanLiteral(true);
      case tokensEnum.FALSE:
        return this.BooleanLiteral(false);
      default:
        throw new SyntaxError('Literal: unexpected literal production, receive ' + this._lookAhead.type);
    }
  }
  /*
   * PrimaryExpression
   * : Literal
   * | Identifier
   * | ParenthesizedExpression
   * ;
   */
  PrimaryExpression() {
    if (this._isLiteral(this._lookAhead.type)) {
      return this.Literal();
    }
    if (this._lookAhead.type === tokensEnum.LEFT_PARENT) {
      return this.ParenthesizedExpression();
    }
    return this.LeftHandSideExpression();
  }
  /*
   * ParenthesizedExpression
   * : LEFT_PARENT Expression RIGHT_PARENT
   * ;
   */
  ParenthesizedExpression() {
    this._eat(tokensEnum.LEFT_PARENT);
    const expression = this.Expression();
    this._eat(tokensEnum.RIGHT_PARENT);
    return expression;
  }

  /*
   * NullLiteral
   *  :NULL
   *   ;
   */
  NullLiteral() {
    const token = this._eat(tokensEnum.NULL);
    return {
      type: ASTTypes.NullLiteral,
      value: null,
    };
  }
  /*
   * BooleanLiteral
   *  :TRUE
   * |FALSE
   * ;
   * */
  BooleanLiteral(value) {
    const tokenEnum = value ? tokensEnum.TRUE : tokensEnum.FALSE;
    const booleanKeyword = this._eat(tokensEnum[tokenEnum]);
    return {
      type: ASTTypes.BooleanLiteral,
      value,
    };
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
  /*
   * StringLiteral
   *  :STRING
   * ;
   */
  StringLiteral() {
    const token = this._eat(tokensEnum.STRING);
    return {
      type: ASTTypes.StringLiteral,
      value: token.value.slice(1, -1),
    };
  }
  /*
   * Identifier
   *  :IDENTIFIER
   * ;
   */
  Identifier() {
    const token = this._eat(tokensEnum.IDENTIFIER);
    return {
      type: ASTTypes.Identifier,
      name: token.value,
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
  _isAssignmentOperator(tokenType) {
    return tokenType === tokensEnum.COMPLEX_ASSIGNMENT || tokenType === tokensEnum.SIMPLE_ASSIGNMENT;
  }
  _checkLeftAssignment(left) {
    if (left.type === ASTTypes.Identifier) {
      return left;
    }
    throw SyntaxError(`Left side of assignment must be a variable`);
  }
  _isLiteral(tokenType) {
    switch (tokenType) {
      case tokensEnum.NUMBER:
      case tokensEnum.STRING:
      case tokensEnum.NULL:
      case tokensEnum.TRUE:
      case tokensEnum.FALSE:
        return true;
      default:
        return false;
    }
  }
  _BinaryExpression(builder, tokenEnum) {
    let left = this[builder]();
    while (this._lookAhead.type === tokensEnum[tokenEnum]) {
      // + / -
      const operator = this._eat(tokensEnum[tokenEnum]).value;
      const right = this[builder]();
      left = {
        type: ASTTypes.BinaryExpression,
        left,
        operator,
        right,
      };
    }
    return left;
  }
}
