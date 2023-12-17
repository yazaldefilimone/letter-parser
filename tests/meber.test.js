import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const MemberExpressionCode = `
    str.length;
    str[0];
  `;
  const MemberExpression = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.MemberExpression,
          object: {
            type: ASTTypes.Identifier,
            name: 'str',
          },
          property: {
            type: ASTTypes.Identifier,
            name: 'length',
          },
          computed: false,
        },
      },
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.MemberExpression,
          object: {
            type: ASTTypes.Identifier,
            name: 'str',
          },
          property: {
            type: ASTTypes.NumericLiteral,
            value: '0',
          },
          computed: true,
        },
      },
    ],
  };

  test(MemberExpressionCode, MemberExpression);

  const MemberExpressionAssignmentCode = `
    str[0] = 'a';
  `;

  const MemberExpressionAssignment = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.AssignmentExpression,
          operator: '=',
          left: {
            type: ASTTypes.MemberExpression,
            object: {
              type: ASTTypes.Identifier,
              name: 'str',
            },
            property: {
              type: ASTTypes.NumericLiteral,
              value: '0',
            },
            computed: true,
          },
          right: {
            type: ASTTypes.StringLiteral,
            value: 'a',
          },
        },
      },
    ],
  };
  test(MemberExpressionAssignmentCode, MemberExpressionAssignment);

  const MemberExpressionAssignment2Code = `
    str.length = 1;
  `;

  const MemberExpressionAssignment2 = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.AssignmentExpression,
          operator: '=',
          left: {
            type: ASTTypes.MemberExpression,
            object: {
              type: ASTTypes.Identifier,
              name: 'str',
            },
            property: {
              type: ASTTypes.Identifier,
              name: 'length',
            },
            computed: false,
          },
          right: {
            type: ASTTypes.NumericLiteral,
            value: '1',
          },
        },
      },
    ],
  };

  test(MemberExpressionAssignment2Code, MemberExpressionAssignment2);

  const memberCode = `
  data.person.card["code"];
  `;

  const memberExp = {
    type: 'Program',
    body: [
      {
        type: ASTTypes.ExpressionStatement,
        expression: {
          type: ASTTypes.MemberExpression,
          computed: true,
          object: {
            type: ASTTypes.MemberExpression,
            computed: false,
            object: {
              type: ASTTypes.MemberExpression,
              computed: false,
              object: {
                type: ASTTypes.Identifier,
                name: 'data',
              },
              property: {
                type: ASTTypes.Identifier,
                name: 'person',
              },
            },
            property: {
              type: ASTTypes.Identifier,
              name: 'card',
            },
          },
          property: {
            type: ASTTypes.StringLiteral,
            value: 'code',
          },
        },
      },
    ],
  };

  test(memberCode, memberExp);
};
