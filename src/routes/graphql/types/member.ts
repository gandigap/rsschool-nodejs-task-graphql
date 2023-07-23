import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { ProfileType } from "./profile.js";
import { Context, Data } from "./common.js";
import { getProfilesByMemberTypeId } from "../resolvers/profile.js";

interface IMemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

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
        profiles: {
          type: new GraphQLList(ProfileType),
          resolve: async (source: IMemberType, _: Data, context: Context) =>
            await getProfilesByMemberTypeId(source.id, context),
        },        
    }),
});
