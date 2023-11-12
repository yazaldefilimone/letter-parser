import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const EmptyStatement = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.EmptyStatement,
      },
    ],
  };
  test(';', EmptyStatement);
};
