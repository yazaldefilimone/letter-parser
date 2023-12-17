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
  LogicalExpression: `LogicalExpression`,
  UnaryExpression: `UnaryExpression`,
  WhileStatement: `WhileStatement`,
  DoWhileStatement: `DoWhileStatement`,
  ForStatement: `ForStatement`,
  FunctionDeclaration: `FunctionDeclaration`,
  ReturnStatement: `ReturnStatement`,
  MemberExpression: `MemberExpression`,
};

// const LiteralCache = new Map();
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
    const stememants = [this.Statement()];
    while (this._lookAhead !== null && this._lookAhead.type !== stopLookToken) {
      stememants.push(this.Statement());
    }
    return stememants;
  }
  /**
   *
   * Statement
   * : ExpressionStatement
   * | BlockStatement
   * | EmptyStatement
   * | IfStatement
   * | VariableStatement
   * | IterationStatement
   * ;
   */
  Statement() {
    if (this._lookAhead === null) {
      return this.EmptyStatement(false);
    }
    switch (this._lookAhead.type) {
      case tokensEnum.SEMICOLON: {
        return this.EmptyStatement();
      }
      case tokensEnum.LEFT_BRACE: {
        return this.BlockStatement();
      }
      case tokensEnum.LET: {
        return this.VariableStatement();
      }
      case tokensEnum.IF: {
        return this.IfStatement();
      }
      case tokensEnum.RETURN: {
        return this.ReturnStatement();
      }
      case tokensEnum.DEF: {
        return this.FunctionDeclaration();
      }
      case tokensEnum.WHILE:
      case tokensEnum.DO:
      case tokensEnum.FOR: {
        return this.IterationStatement();
      }
      default: {
        return this.ExpressionStatement();
      }
    }
  }

  /*
   * FunctionDeclaration
   * : DEF Identifier LEFT_PARENT FormalParamenterList RIGHT_PARENT BlockStatement
   * ;
   */
  FunctionDeclaration() {
    const defkeyword = this._eat(tokensEnum.DEF);
    const id = this.Identifier();
    this._eat(tokensEnum.LEFT_PARENT);
    const params = this.FormalParamenterList();
    this._eat(tokensEnum.RIGHT_PARENT);
    const body = this.BlockStatement();
    return {
      type: ASTTypes.FunctionDeclaration,
      id,
      params,
      body,
    };
  }

  /*
   * FormalParamenterList
   * : FormalParamenterList COMMA Identifier
   * | Identifier
   * ;
   */
  FormalParamenterList() {
    if (this._lookAhead.type === tokensEnum.RIGHT_PARENT) {
      return [];
    }
    const identifiers = [this.Identifier()];
    while (this._lookAhead.type === tokensEnum.COMMA) {
      this._eat(tokensEnum.COMMA);
      identifiers.push(this.Identifier());
    }
    return identifiers;
  }

  /*
   * ReturnStatement
   * : RETURN Expression SEMICOLON
   * ;
   */
  ReturnStatement() {
    const returnKeyword = this._eat(tokensEnum.RETURN);
    let argument = null;
    if (this._lookAhead.type !== tokensEnum.SEMICOLON) {
      argument = this.Expression();
    }
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.ReturnStatement,
      argument,
    };
  }
  /**
   * IterationStatement
   * : WHILE ParenthesizedExpression Statement
   * | DO Statement WHILE ParenthesizedExpression SEMICOLON
   * | FOR LEFT_PARENT ExpressionStatement ExpressionStatement RIGHT_PARENT Statement
   * ;
   */

  IterationStatement() {
    switch (this._lookAhead.type) {
      case tokensEnum.WHILE: {
        return this.WhileStatement();
      }
      case tokensEnum.DO: {
        return this.DoWhileStatement();
      }
      case tokensEnum.FOR: {
        return this.ForStatement();
      }
    }
  }
  /**
   * WhileStatement
   * : WHILE ParenthesizedExpression Statement
   * ;
   */
  WhileStatement() {
    const whileKeyword = this._eat(tokensEnum.WHILE);
    const test = this.ParenthesizedExpression();
    const body = this.Statement();
    return {
      type: ASTTypes.WhileStatement,
      test,
      body,
    };
  }

  /**
   * DoWhileStatement
   * : DO Statement WHILE ParenthesizedExpression SEMICOLON
   * ;
   */
  DoWhileStatement() {
    const doWhileKeyword = this._eat(tokensEnum.DO);
    const body = this.Statement();
    const whileKeyword = this._eat(tokensEnum.WHILE);
    const test = this.ParenthesizedExpression();
    this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.DoWhileStatement,
      body,
      test,
    };
  }

  /**
   * ForStatement
   * : FOR LEFT_PARENT ExpressionStatement ExpressionStatement RIGHT_PARENT Statement
   * ;
   */
  ForStatement() {
    const forKeyword = this._eat(tokensEnum.FOR);
    this._eat(tokensEnum.LEFT_PARENT);
    const init = this._lookAhead.type === tokensEnum.SEMICOLON ? null : this.ForStatementInit();
    this._eat(tokensEnum.SEMICOLON);
    const test = this._lookAhead.type === tokensEnum.SEMICOLON ? null : this.Expression();
    this._eat(tokensEnum.SEMICOLON);
    const update = this._lookAhead.type === tokensEnum.RIGHT_PARENT ? null : this.Expression();
    this._eat(tokensEnum.RIGHT_PARENT);
    const body = this.Statement();
    return {
      type: ASTTypes.ForStatement,
      init,
      test,
      update,
      body,
    };
  }

  /**
   * ForStatementInit
   * : VariableStatement
   * | ExpressionStatement
   * ;
   */
  ForStatementInit() {
    if (this._lookAhead.type === tokensEnum.LET) {
      return this.VariableStatementInit();
    }
    return this.Expression();
  }

  /*
   * IfStatement
   * : IF ParenthesizedExpression Statement ElseStatement
   * ;
   */
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
   * VariableStatementInit
   * : LET VariableDeclarationList
   * ;
   */

  VariableStatementInit() {
    const letKeyword = this._eat(tokensEnum.LET);
    const declarations = this.VariableDeclarationList();
    return {
      type: ASTTypes.VariableStatement,
      declarations,
    };
  }
  /*
   * VariableStatement
   * : LET VariableDeclarationList SEMICOLON
   * ;
   */
  VariableStatement() {
    const variableStatement = this.VariableStatementInit();
    this._eat(tokensEnum.SEMICOLON);
    return variableStatement;
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
   * UnaryExpression
   * : LeftHandSideExpression
   * | ADDITIVE_OPERATOR UnaryExpression
   * | LOGICAL_NOT UnaryExpression
   */
  UnaryExpression() {
    let operator = null;
    let prefix = false;
    switch (this._lookAhead.type) {
      case tokensEnum.ADDITIVE_OPERATOR:
        operator = this._eat(tokensEnum.ADDITIVE_OPERATOR).value;
        prefix = true;
        break;
      case tokensEnum.LOGICAL_NOT:
        operator = this._eat(tokensEnum.LOGICAL_NOT).value;
        prefix = true;
        break;
    }
    if (operator !== null) {
      const argument = this.UnaryExpression();
      return {
        type: ASTTypes.UnaryExpression,
        operator,
        argument,
        prefix,
      };
    }
    return this.LeftHandSideExpression();
  }
  /*
   * AssignmentExpression
   * : LogicalOrExpression AssignmentOperator AssignmentExpression
   * | LogicalOrExpression
   * ;
   */
  AssignmentExpression() {
    const leftToken = this.LogicalOrExpression();
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
   * RelationalExpression
   * : AdditiveExpression
   * | EqualityExpression EQUALITY_OPERATOR RelationalExpression
   * ;
   */
  RelationalExpression() {
    return this._BinaryExpression('AdditiveExpression', tokensEnum.RELATIONAL_OPERATOR);
  }

  /*
   * LeftHandSideExpression
   * : PrimaryExpression
   * ;
   */

  LeftHandSideExpression() {
    return this.MemberExpression();
  }

  /*
   * MemberExpression
   * : PrimaryExpression
   * | MemberExpression LEFT_BRACKET Expression RIGHT_BRACKET
   * | MemberExpression DOT Identifier
   */
  MemberExpression() {
    let object = this.PrimaryExpression();
    while (this._lookAhead.type === tokensEnum.LEFT_BRACKET || this._lookAhead.type === tokensEnum.DOT) {
      if (this._lookAhead.type === tokensEnum.LEFT_BRACKET) {
        this._eat(tokensEnum.LEFT_BRACKET);
        const property = this.Expression();
        this._eat(tokensEnum.RIGHT_BRACKET);
        object = {
          type: ASTTypes.MemberExpression,
          object,
          property,
          computed: true,
        };
      }

      if (this._lookAhead.type === tokensEnum.DOT) {
        this._eat(tokensEnum.DOT);
        const property = this.Identifier();
        object = {
          type: ASTTypes.MemberExpression,
          object,
          property,
          computed: false,
        };
      }
    }

    return object;
  }
  /*
   * LogicalAndExpression
   * : EqualityExpression LOGICAL_AND LogicalAndExpression
   * | EqualityExpression
   * ;
   */
  LogicalAndExpression() {
    return this._LogicalExpression('EqualityExpression', tokensEnum.LOGICAL_AND);
  }

  /*
   * LogicalOrExpression
   * : EqualityExpression LOGICAL_OR LogicalOrExpression
   * | EqualityExpression
   * ;
   */
  LogicalOrExpression() {
    return this._LogicalExpression('LogicalAndExpression', tokensEnum.LOGICAL_OR);
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
   */
  EmptyStatement(withSemicolon = true) {
    if (withSemicolon) this._eat(tokensEnum.SEMICOLON);
    return {
      type: ASTTypes.EmptyStatement,
    };
  }
  /*s
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
    return this._BinaryExpression('UnaryExpression', tokensEnum.MULTIPLICATIVE_OPERATOR);
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
    switch (this._lookAhead.type) {
      case tokensEnum.LEFT_PARENT:
        return this.ParenthesizedExpression();
      case tokensEnum.IDENTIFIER:
        return this.Identifier();
      default:
        return this.LeftHandSideExpression();
    }
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
    const token = value ? tokensEnum.TRUE : tokensEnum.FALSE;
    const booleanKeyword = this._eat(token);
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
    switch (left.type) {
      case ASTTypes.Identifier:
      case ASTTypes.MemberExpression: {
        return left;
      }
      default: {
        throw SyntaxError(`Left side of assignment must be a variable`);
      }
    }
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

  _LogicalExpression(builder, tokenEnum) {
    let left = this[builder]();
    if (this._lookAhead.type === tokensEnum[tokenEnum]) {
      const operator = this._eat(tokensEnum[tokenEnum]).value;
      const right = this[builder]();
      left = {
        type: ASTTypes.LogicalExpression,
        left,
        operator,
        right,
      };
    }
    return left;
  }
}
