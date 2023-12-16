import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const whileLoopCode = `
  do {
    x -= 1;
  } while(x < 10);
  `;
  const WhileLoopStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.DoWhileStatement,
        body: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.ExpressionStatement,
              expression: {
                type: ASTTypes.AssignmentExpression,
                operator: '-=',
                left: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                right: {
                  type: ASTTypes.NumericLiteral,
                  value: '1',
                },
              },
            },
          ],
        },
        test: {
          type: ASTTypes.BinaryExpression,
          operator: '<',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.NumericLiteral,
            value: '10',
          },
        },
      },
    ],
  };
  test(whileLoopCode, WhileLoopStatement);
};
