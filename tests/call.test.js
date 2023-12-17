import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const callCode = `
  square(5);
  `;
  const callStatement = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.CallExpression,
          callee: {
            type: ASTTypes.Identifier,
            name: 'square',
          },
          arguments: [
            {
              type: ASTTypes.NumericLiteral,
              value: '5',
            },
          ],
        },
      },
    ],
  };

  test(callCode, callStatement);
};
