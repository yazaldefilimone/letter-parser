import { ASTTypes } from '../src/parser.js';

export default (test) => {
  const classDeclarationCode = `
  class Point {
   def constructor(x, y) {
     this.x = x;
     this.y = y;
   }
   def calc() {
     return this.x + this.y;
   }
  }
 `;
  const classDeclaration = {
    type: ASTTypes.Program,
    body: [
      {
        type: ASTTypes.ClassDeclaration,
        id: {
          type: ASTTypes.Identifier,
          name: 'Point',
        },
        superClass: null,
        body: {
          type: ASTTypes.BlockStatement,
          body: [
            {
              type: ASTTypes.FunctionDeclaration,
              id: {
                type: ASTTypes.Identifier,
                name: 'constructor',
              },
              params: [
                {
                  type: ASTTypes.Identifier,
                  name: 'x',
                },
                {
                  type: ASTTypes.Identifier,
                  name: 'y',
                },
              ],
              body: {
                type: ASTTypes.BlockStatement,
                body: [
                  {
                    type: ASTTypes.ExpressionStatement,
                    expression: {
                      type: ASTTypes.AssignmentExpression,
                      left: {
                        type: ASTTypes.MemberExpression,
                        object: {
                          type: ASTTypes.ThisExpression,
                        },
                        property: {
                          type: ASTTypes.Identifier,
                          name: 'x',
                        },
                        computed: false,
                      },
                      operator: '=',
                      right: {
                        type: ASTTypes.Identifier,
                        name: 'x',
                      },
                    },
                  },
                  {
                    type: ASTTypes.ExpressionStatement,
                    expression: {
                      type: ASTTypes.AssignmentExpression,
                      left: {
                        type: ASTTypes.MemberExpression,
                        object: {
                          type: ASTTypes.ThisExpression,
                        },
                        property: {
                          type: ASTTypes.Identifier,
                          name: 'y',
                        },
                        computed: false,
                      },
                      operator: '=',
                      right: {
                        type: ASTTypes.Identifier,
                        name: 'y',
                      },
                    },
                  },
                ],
              },
            },
            {
              type: ASTTypes.FunctionDeclaration,
              id: {
                type: ASTTypes.Identifier,
                name: 'calc',
              },
              params: [],
              body: {
                type: ASTTypes.BlockStatement,
                body: [
                  {
                    type: ASTTypes.ReturnStatement,
                    argument: {
                      type: ASTTypes.BinaryExpression,
                      left: {
                        type: ASTTypes.MemberExpression,
                        object: {
                          type: ASTTypes.ThisExpression,
                        },
                        property: {
                          type: ASTTypes.Identifier,
                          name: 'x',
                        },
                        computed: false,
                      },
                      operator: '+',
                      right: {
                        type: ASTTypes.MemberExpression,
                        object: {
                          type: ASTTypes.ThisExpression,
                        },
                        property: {
                          type: ASTTypes.Identifier,
                          name: 'y',
                        },
                        computed: false,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };
  test(classDeclarationCode, classDeclaration);
  // const classDeclarationWithInheritanceCode = `
  // class Point3D extends Point {
  //  def constructor(x, y, z) {
  //     super(x, y);
  //     this.z = z;
  //  }
  //  def calc() {
  //     return super.calc() + this.z;
  //  }

  // }
  // `;

  // const classDeclarationWithInheritance = {
  //   type: ASTTypes.Program,
  //   body: [
  //     {
  //       type: ASTTypes.ClassDeclaration,
  //       id: {
  //         type: ASTTypes.Identifier,
  //         name: ASTTypes.Point3D,
  //       },
  //       superClass: {
  //         type: ASTTypes.Identifier,
  //         name: ASTTypes.Point,
  //       },
  //       body: [
  //         {
  //           type: ASTTypes.BlockStatement,
  //           body: [
  //             {
  //               type: ASTTypes.FunctionDeclaration,
  //               id: {
  //                 type: ASTTypes.Identifier,
  //                 name: ASTTypes.constructor,
  //               },
  //               params: [
  //                 {
  //                   type: ASTTypes.Identifier,
  //                   name: 'x',
  //                 },
  //                 {
  //                   type: ASTTypes.Identifier,
  //                   name: 'y',
  //                 },
  //               ],
  //             },
  //           ],
  //         },

  //         {
  //           type: ASTTypes.FunctionDeclaration,
  //           id: {
  //             type: ASTTypes.Identifier,
  //             name: ASTTypes.calc,
  //           },
  //           params: [],
  //           body: {
  //             type: ASTTypes.BlockStatement,
  //             body: [
  //               {
  //                 type: ASTTypes.ReturnStatement,
  //                 argument: {
  //                   type: ASTTypes.BinaryExpression,
  //                   operator: ASTTypes.+,
  //                   left: {
  //                     type: ASTTypes.MemberExpression,
  //                     computed: false,
  //                     object: {
  //                       type: ASTTypes.CallExpression,
  //                       callee: {
  //                         type: ASTTypes.Super,
  //                       },
  //                       arguments: [
  //                         {
  //                           type: ASTTypes.Identifier,
  //                           name: 'x',
  //                         },
  //                         {
  //                           type: ASTTypes.Identifier,
  //                           name: 'y',
  //                         },
  //                       ],
  //                     },
  //                   },
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };
};
