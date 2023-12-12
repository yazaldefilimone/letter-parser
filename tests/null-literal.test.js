import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const NullLiteral = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          operator: '==',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.NullLiteral,
            value: null,
          },
        },
      },
    ],
  };
  test('x == null;', NullLiteral);
};
