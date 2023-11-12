import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const NumberLiteral = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.NumericLiteral,
          value: '40',
        },
      },
    ],
  };
  test('40;', NumberLiteral);

  const StringLiteral = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.StringLiteral,
          value: 'Hello',
        },
      },
    ],
  };

  test(`"Hello";`, StringLiteral);

  test(`'Hello';`, StringLiteral);
};
