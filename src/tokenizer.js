export const tokensEnum = {
  NUMBER: 'NUMBER',
  STRING: `STRING`,
  ADDITIVE_OPERATOR: `ADDITIVE_OPERATOR`,
  MULTIPLICATIVE_OPERATOR: `MULTIPLICATIVE_OPERATOR`,
  SEMICOLON: `;`,
  LEFT_BRACE: `{`,
  IDENTIFIER: `IDENTIFIER`,
  RIGHT_BRACE: `}`,
  LEFT_PARENT: `(`,
  SIMPLE_ASSIGNMENT: `SIMPLE_ASSIGNMENT`,
  COMPLEX_ASSIGNMENT: `COMPLEX_ASSIGNMENT`,
  RIGHT_PARENT: `)`,
  IF: `if`,
  ELSE: `else`,
  LET: `let`,
  COMMA: `,`,
};
const spec = [
  // keywords
  [/^\blet\b/, tokensEnum.LET],
  [/^\bif\b/, tokensEnum.IF],
  [/^\belse\b/, tokensEnum.ELSE],
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
  // comma
  [/^,/, tokensEnum.COMMA],
  // identifier
  [/^\w+/, tokensEnum.IDENTIFIER],
  //  simple assignments
  [/^=/, tokensEnum.SIMPLE_ASSIGNMENT],
  // complex assignments
  [/^[+/*-]=/, tokensEnum.COMPLEX_ASSIGNMENT],

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
