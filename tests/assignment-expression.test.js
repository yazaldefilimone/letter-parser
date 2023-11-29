import { ASTTypes } from '../src/parser.js';

export default (test) => {
  let assignment = `x = 2;`;
  let assignmentExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.AssignmentExpression,
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
      },
    ],
  };
  test(assignment, assignmentExpression);
  assignment = `x = y = 2;`;
  assignmentExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.AssignmentExpression,
          operator: '=',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.AssignmentExpression,
            operator: '=',
            left: {
              type: ASTTypes.Identifier,
              name: 'y',
            },
            right: {
              type: ASTTypes.NumericLiteral,
              value: 2,
            },
          },
        },
      },
    ],
  };
  test(assignment, assignmentExpression);
};
