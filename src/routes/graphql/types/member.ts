import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";

export const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      [MemberTypeId.BASIC]: {
        value: MemberTypeId.BASIC,
      },
      [MemberTypeId.BUSINESS]: {
        value: MemberTypeId.BUSINESS,
      },
    },
  });
  
export const MemberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        id: { type: MemberTypeIdEnum },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },        
    }),
});
