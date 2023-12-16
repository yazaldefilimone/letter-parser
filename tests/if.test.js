import { ASTTypes } from '../src/parser.js';

export default (test) => {
  let code = `
  if(x){
    x = 1;
  } else {
    x = 2;
  }
  `;
  let ast = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.IfStatement,
        test: {
          type: ASTTypes.Identifier,
          name: 'x',
        },
        consequent: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.ExpressionStatement,
              expression: {
                type: ASTTypes.AssignmentExpression,
                left: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                operator: '=',
                right: {
                  type: ASTTypes.NumericLiteral,
                  value: '1',
                },
              },
            },
          ],
        },
        alternate: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.ExpressionStatement,
              expression: {
                type: ASTTypes.AssignmentExpression,
                left: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                operator: '=',
                right: {
                  type: ASTTypes.NumericLiteral,
                  value: '2',
                },
              },
            },
          ],
        },
      },
    ],
  };
  test(code, ast);
};
