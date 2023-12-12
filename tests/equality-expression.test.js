import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const isEqual = {
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
            type: ASTTypes.NumericLiteral,
            value: '2',
          },
        },
      },
    ],
  };
  const code = 'x == 2;';
  test(code, isEqual);

  const isNotEqual = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          operator: '!=',
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
  const code2 = 'x != 2;';
  test(code2, isNotEqual);
  const code3 = 'x +1 == true;';

  const equalityWithBoolean = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          operator: '==',
          left: {
            type: ASTTypes.BinaryExpression,
            operator: '+',
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
            type: ASTTypes.BooleanLiteral,
            value: true,
          },
        },
      },
    ],
  };
  test(code3, equalityWithBoolean);

  const code4 = 'x - 1 > 2 == false;';
  const equalityWithBoolean2 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          operator: '==',
          left: {
            type: ASTTypes.BinaryExpression,
            operator: '>',
            left: {
              type: ASTTypes.BinaryExpression,
              operator: '-',
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
              type: ASTTypes.NumericLiteral,
              value: '2',
            },
          },
          right: {
            type: ASTTypes.BooleanLiteral,
            value: false,
          },
        },
      },
    ],
  };
  test(code4, equalityWithBoolean2);
};
