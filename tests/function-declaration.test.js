import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const functionDeclarationCode = `
    def square(x) {
      return x * x;
    }
  `;
  const functionDeclarationStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.FunctionDeclaration,
        id: {
          type: ASTTypes.Identifier,
          name: 'square',
        },
        params: [
          {
            type: ASTTypes.Identifier,
            name: 'x',
          },
        ],
        body: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.ReturnStatement,
              argument: {
                type: ASTTypes.BinaryExpression,
                operator: '*',
                left: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                right: {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
              },
            },
          ],
        },
      },
    ],
  };
  test(functionDeclarationCode, functionDeclarationStatement);
};
