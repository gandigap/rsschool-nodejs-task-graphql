import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from './types/user.js';
import { MemberType, MemberTypeIdEnum } from './types/member.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type : new GraphQLNonNull(UUIDType) }
      }
    },
    users: { type: new GraphQLList(UserType)},
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum)}
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberType)
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: CreateUserInputType }
      }
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInputType }
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: {type: new GraphQLNonNull(UUIDType) }
      }
    }
  }
})


export const schema = new GraphQLSchema({query: Query, mutation : Mutation})