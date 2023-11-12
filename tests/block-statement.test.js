import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const block = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.BlockStatement,
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
      },
    ],
  };
  const nestedBlock = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.BlockStatement,
        body: [
          {
            type: ASTTypes.ExpressionStatement,
            expression: {
              type: ASTTypes.NumericLiteral,
              value: '40',
            },
          },
          {
            type: ASTTypes.BlockStatement,
            body: [
              {
                type: ASTTypes.ExpressionStatement,
                expression: {
                  type: ASTTypes.StringLiteral,
                  value: 'Hello',
                },
              },
            ],
          },
        ],
      },
    ],
  };
  test(
    `
    {
      40;
      "Hello";
    }
  `,
    block,
  );

  test(
    `
    {
     
    }
  `,
    {
      type: 'Program',
      body: [
        {
          type: ASTTypes.BlockStatement,
          body: [],
        },
      ],
    },
  );

  test(
    `
  {
    40;
    {
      "Hello";
    }
  }
  `,
    nestedBlock,
  );
};
