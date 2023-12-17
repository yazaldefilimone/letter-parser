import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const ForLoopCode = `
  for (x = 10; x > 0; x -= 1) {
    x - 1;
  }
  `;
  const ForLoopStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ForStatement,
        init: {
          type: ASTTypes.AssignmentExpression,
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          operator: '=',
          right: {
            type: ASTTypes.NumericLiteral,
            value: '10',
          },
        },
        test: {
          type: ASTTypes.BinaryExpression,
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          operator: '>',
          right: {
            type: ASTTypes.NumericLiteral,
            value: '0',
          },
        },
        update: {
          type: ASTTypes.AssignmentExpression,
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          operator: '-=',
          right: {
            type: ASTTypes.NumericLiteral,
            value: '1',
          },
        },
        body: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.ExpressionStatement,
              expression: {
                type: ASTTypes.BinaryExpression,
                left: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                operator: '-',
                right: {
                  type: ASTTypes.NumericLiteral,
                  value: '1',
                },
              },
            },
          ],
        },
      },
    ],
  };
  test(ForLoopCode, ForLoopStatement);

  const ForLoopEmpty = `
  for (;;) {}
  `;
  const ForLoopEmptyStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ForStatement,
        init: null,
        test: null,
        update: null,
        body: {
          type: ASTTypes.BlockStatement,
          body: [],
        },
      },
    ],
  };

  test(ForLoopEmpty, ForLoopEmptyStatement);
};
