import { ASTTypes } from '../src/parser.js';

const NumberLiteral = (value) => ({
  type: ASTTypes.NumericLiteral,
  value: value,
});

export default (test) => {
  /**
   * left: 2
   * operator: +
   * right: 2
   */
  const code_test_1 = '2 + 2;';
  const binary_test_1 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          left: NumberLiteral('2'),
          operator: '+',
          right: NumberLiteral('2'),
        },
      },
    ],
  };

  test(code_test_1, binary_test_1);

  /**
   * left: 3 + 2
   * operator: -
   * right: 2
   */
  const code_test_2 = '3 + 2 - 2;';
  const binary_test_2 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          left: {
            type: ASTTypes.BinaryExpression,
            left: NumberLiteral('3'),
            operator: '+',
            right: NumberLiteral('2'),
          },
          operator: '-',
          right: NumberLiteral('2'),
        },
      },
    ],
  };
  test(code_test_2, binary_test_2);
  /**
   * left: 2 + 2
   * operator: +
   * right: 2
   */
  const code_test_3 = '2 + 2 * 2;';
  const binary_test_3 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          left: NumberLiteral('2'),
          operator: '+',
          right: {
            type: ASTTypes.BinaryExpression,
            left: NumberLiteral('2'),
            operator: '*',
            right: NumberLiteral('2'),
          },
        },
      },
    ],
  };
  test(code_test_3, binary_test_3);
  /**
   * left:  2 + 2
   * operator: *
   * right: 2
   */
  const code_test_4 = '(2 + 2) * 2;';
  const binary_test_4 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.BinaryExpression,
          left: {
            type: ASTTypes.BinaryExpression,
            left: NumberLiteral('2'),
            operator: '+',
            right: NumberLiteral('2'),
          },
          operator: '*',
          right: NumberLiteral('2'),
        },
      },
    ],
  };
  test(code_test_4, binary_test_4);
};
