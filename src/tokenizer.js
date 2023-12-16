export const tokensEnum = {
  NUMBER: 'NUMBER',
  STRING: `STRING`,
  ADDITIVE_OPERATOR: `ADDITIVE_OPERATOR`,
  RELATIONAL_OPERATOR: `RELATIONAL_OPERATOR`,
  MULTIPLICATIVE_OPERATOR: `MULTIPLICATIVE_OPERATOR`,
  SEMICOLON: `;`,
  LEFT_BRACE: `{`,
  IDENTIFIER: `IDENTIFIER`,
  RIGHT_BRACE: `}`,
  LEFT_PARENT: `(`,
  SIMPLE_ASSIGNMENT: `SIMPLE_ASSIGNMENT`,
  COMPLEX_ASSIGNMENT: `COMPLEX_ASSIGNMENT`,
  EQUALITY_OPERATOR: `EQUALITY_OPERATOR`,
  RIGHT_PARENT: `)`,
  IF: `if`,
  ELSE: `else`,
  LET: `let`,
  TRUE: `true`,
  FALSE: `false`,
  NULL: `null`,
  COMMA: `,`,
  // logical operators
  LOGICAL_AND: `LOGICAL_AND`,
  LOGICAL_OR: `LOGICAL_OR`,
  LOGICAL_NOT: `LOGICAL_NOT`,
  WHILE: `while`,
  DO: `do`,
  FOR: `for`,
};
const spec = [
  // keywords
  [/^\blet\b/, tokensEnum.LET],
  [/^\bif\b/, tokensEnum.IF],
  [/^\belse\b/, tokensEnum.ELSE],
  [/^\btrue\b/, tokensEnum.TRUE],
  [/^\bfalse\b/, tokensEnum.FALSE],
  [/^\bnull\b/, tokensEnum.NULL],
  [/^\bwhile\b/, tokensEnum.WHILE],
  [/^\bdo\b/, tokensEnum.DO],
  [/^\bfor\b/, tokensEnum.FOR],
  // numbers
  [/^\d+/, tokensEnum.NUMBER],
  // strings ""
  [/^"[^"]*"/, tokensEnum.STRING],
  // strings ''
  [/^'[^']*'/, tokensEnum.STRING],
  // whitespace ___
  [/^\s+/, null],
  // skip single line comment
  [/^\/\/.*/, null],
  // skip multi-line comment
  [/^\/\*[\s\S]*?\*\//, null],
  // end of statement
  [/^;/, tokensEnum.SEMICOLON],
  // block
  [/^\{/, tokensEnum.LEFT_BRACE],
  [/^\}/, tokensEnum.RIGHT_BRACE],
  // relational operators
  [/^[<>]=?/, tokensEnum.RELATIONAL_OPERATOR],
  // comma
  [/^,/, tokensEnum.COMMA],
  // identifier
  [/^\w+/, tokensEnum.IDENTIFIER],
  // equality operators = == !=
  [/^[=!]=/, tokensEnum.EQUALITY_OPERATOR],
  //  simple assignments
  [/^=/, tokensEnum.SIMPLE_ASSIGNMENT],
  // complex assignments
  [/^[+/*-]=/, tokensEnum.COMPLEX_ASSIGNMENT],
  // logical operators
  [/^&&/, tokensEnum.LOGICAL_AND],
  [/^\|\|/, tokensEnum.LOGICAL_OR],
  [/^!/, tokensEnum.LOGICAL_NOT],
  //
  [/^\(/, tokensEnum.LEFT_PARENT],
  [/^\)/, tokensEnum.RIGHT_PARENT],
  // math: -/+
  [/^[+/-]/, tokensEnum.ADDITIVE_OPERATOR],
  [/^[*/]/, tokensEnum.MULTIPLICATIVE_OPERATOR],
];

export class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  getNextToken() {
    if (!this._isHasTokens()) {
      return null;
    }

    const current = this._string.slice(this._cursor);
    for (const [regex, type] of spec) {
      const value = this._match(regex, current);
      // can't match this rule.... continue
      if (value === null) {
        continue;
      }
      // should skip token... e.g. whitespace
      if (type === null) {
        return this.getNextToken();
      }
      return {
        type,
        value,
      };
    }
    throw SyntaxError(`unexpected token type  "${current[0]}"`);
  }

  _isHasTokens() {
    return this._cursor < this._string.length;
  }
  _isEOF() {
    return this._cursor === this._string.length;
  }
  _match(regex, value) {
    const matched = regex.exec(value);
    if (matched === null) {
      return null;
    }
    this._cursor += matched[0].length;
    return matched[0];
  }
}
