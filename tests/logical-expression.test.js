import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const LogicalANDExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.LogicalExpression,
          operator: '&&',
          left: {
            type: ASTTypes.BinaryExpression,
            operator: '<',
            left: {
              type: ASTTypes.Identifier,
              name: 'x',
            },
            right: {
              type: ASTTypes.NumericLiteral,
              value: '1',
            },
          },
          right: {
            type: ASTTypes.BinaryExpression,
            operator: '>',
            left: {
              type: ASTTypes.Identifier,
              name: 'x',
            },
            right: {
              type: ASTTypes.NumericLiteral,
              value: '5',
            },
          },
        },
      },
    ],
  };
  test('x < 1 && x > 5;', LogicalANDExpression);
  const LogicalORExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.LogicalExpression,
          operator: '||',
          left: {
            type: ASTTypes.BinaryExpression,
            operator: '>',
            left: {
              type: ASTTypes.Identifier,
              name: 'x',
            },
            right: {
              type: ASTTypes.NumericLiteral,
              value: '1',
            },
          },
          right: {
            type: ASTTypes.BinaryExpression,
            operator: '<',
            left: {
              type: ASTTypes.Identifier,
              name: 'x',
            },
            right: {
              type: ASTTypes.NumericLiteral,
              value: '5',
            },
          },
        },
      },
    ],
  };
  test('x > 1 || x < 5;', LogicalORExpression);
};
