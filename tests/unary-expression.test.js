import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const codeMinus = `-x;`;
  const UnaryMinus = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.UnaryExpression,
          operator: '-',
          argument: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          prefix: true,
        },
      },
    ],
  };
  test(codeMinus, UnaryMinus);

  const codePlus = `+x;`;
  const UnaryPlus = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.UnaryExpression,
          operator: '+',
          argument: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          prefix: true,
        },
      },
    ],
  };
  test(codePlus, UnaryPlus);

  const codeNot = `!x;`;
  const UnaryNot = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.UnaryExpression,
          operator: '!',
          argument: {
            type: ASTTypes.Identifier,
            name: 'x',
          },
          prefix: true,
        },
      },
    ],
  };
  test(codeNot, UnaryNot);
};
