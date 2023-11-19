import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const assignment = `let x = (2+3) * 2`;
  const assignmentExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.EmptyStatement,
      },
    ],
  };
  test(assignment, assignmentExpression);
};
