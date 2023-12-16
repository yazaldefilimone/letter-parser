import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const whileLoopCode = `
  while(x < 10){
    x -= 1;
  }
  `;
  const WhileLoopStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.WhileStatement,
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
      },
    ],
  };
  test(whileLoopCode, WhileLoopStatement);
};
