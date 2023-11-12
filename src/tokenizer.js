export const tokenTypes = {
  NUMBER: 'NUMBER',
  STRING: `STRING`,
};

const spec = [
  // numbers
  [/^\d+/, tokenTypes.NUMBER],
  // strings ""
  [/^"[^"]*"/, tokenTypes.STRING],
  // strings ''
  [/^'[^']*'/, tokenTypes.STRING],
  // whitespace ___
  [/^\s+/, null],
  // skip single line comment
  [/^\/\/.*/, null],
  // skip multi-line comment
  [/^\/\*[\s\S]*?\*\//, null],
  // skip multi-line comment
  [/^;/, ';'],
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
