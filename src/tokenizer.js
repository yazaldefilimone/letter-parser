export const tokenTypes = {
  NUMBER: 'NUMBER',
  STRING: `STRING`,
};
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

    if (!Number.isNaN(Number(current.at(0)))) {
      let numbers = current.at(0);
      this._cursor++;
      while (!Number.isNaN(Number(current.at(this._cursor)))) {
        numbers += current.at(this._cursor++);
      }
      return {
        type: tokenTypes.NUMBER,
        value: numbers,
      };
    }

    if (current.at(0) === '"') {
      let str = '';
      do {
        str += current.at(this._cursor++);
      } while (current.at(this._cursor) !== '"' && !this._isEOF());
      str += this._cursor++; // skip "
      return {
        type: tokenTypes.STRING,
        value: str,
      };
    }

    return null;
  }

  _isHasTokens() {
    return this._cursor < this._string.length;
  }
  _isEOF() {
    return this._cursor === this._string.length;
  }
}
