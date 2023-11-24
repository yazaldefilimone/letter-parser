import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const assignment = `x = 2;`;
  const assignmentExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.BinaryExpression,
        operator: '=',
        left: {
          type: ASTTypes.Identifier,
          name: 'x',
        },
        right: {
          type: ASTTypes.NumericLiteral,
          value: 2,
        },
      },
    ],
  };
  test(assignment, assignmentExpression);
};
