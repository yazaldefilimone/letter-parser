import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const relational = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          operator: '>',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.NumericLiteral,
            value: '2',
          },
        },
      },
    ],
  };
  test('x > 2;', relational);
};
