import {
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
  } from 'graphql';
  import { UUIDType } from './uuid.js';
  import { MemberType, MemberTypeIdEnum } from './member.js';
  import { Context, ID, Data } from './common.js';
  import { MemberTypeId } from '../../member-types/schemas.js';
  import { getMemberType } from '../resolvers/member.js';
  import { UserType } from './user.js';
  import { getUser } from '../resolvers/user.js';
  
  export interface ProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: MemberTypeId;
    userId: string;
}
  
export interface Profile extends ID, ProfileInput {}

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        memberType: {
            type: new GraphQLNonNull(MemberType),
            resolve: async (source: Profile, _: Data, context: Context) => {
                return await getMemberType({ id: source.memberTypeId }, context)
            }                
        },
        user: {
            type: UserType ,
            resolve: async (source: Profile, _: Data, context: Context) => {
                return await getUser({ id: source.userId }, context)
            }
        }
    }),
});
  
export const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
      memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      userId: { type: new GraphQLNonNull(UUIDType) }
    },
});
  
export const ChangeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdEnum }
    },
});