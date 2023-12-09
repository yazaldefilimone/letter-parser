import { ASTTypes } from '../src/parser.js';

export default (test) => {
  let code = `
  let x = 10;
  `;
  let ast = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.VariableStatement,
        declarations: [
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'x',
            },
            init: {
              type: ASTTypes.NumericLiteral,
              value: '10',
            },
          },
        ],
      },
    ],
  };
  test(code, ast);

  code = `
   let y;`;

  ast = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.VariableStatement,
        declarations: [
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'y',
            },
            init: null,
          },
        ],
      },
    ],
  };
  test(code, ast);

  code = `
  let z, a = 10;
  `;
  ast = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.VariableStatement,
        declarations: [
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'z',
            },
            init: null,
          },
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'a',
            },
            init: {
              type: ASTTypes.NumericLiteral,
              value: '10',
            },
          },
        ],
      },
    ],
  };
  test(code, ast);

  code = `
  let b, c;
  `;
  ast = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.VariableStatement,
        declarations: [
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'b',
            },
            init: null,
          },
          {
            type: ASTTypes.VariableDeclaration,
            id: {
              type: ASTTypes.Identifier,
              name: 'c',
            },
            init: null,
          },
        ],
      },
    ],
  };
  test(code, ast);
};
