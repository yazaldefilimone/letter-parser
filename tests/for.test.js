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
          operator: '=',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.Literal,
            value: 10,
          },
        },
        test: {
          type: ASTTypes.BinaryExpression,
          operator: '>',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.Literal,
            value: 0,
          },
        },
        update: {
          type: ASTTypes.AssignmentExpression,
          operator: '-=',
          left: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          right: {
            type: ASTTypes.Literal,
            value: 1,
          },
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
      },
    ],
  };

  test(ForLoopEmpty, ForLoopEmptyStatement);
};
