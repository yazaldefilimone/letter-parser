import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const statements = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.NumericLiteral,
          value: '40',
        },
      },
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.StringLiteral,
          value: 'Hello',
        },
      },
    ],
  };
  test(
    `40;
  "Hello";
  `,
    statements,
  );
};
