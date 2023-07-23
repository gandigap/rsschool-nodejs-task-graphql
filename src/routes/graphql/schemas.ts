import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from './types/user.js';
import { MemberType, MemberTypeIdEnum } from './types/member.js';
import { ChangePostInputType, CreatePostInputType, PostType } from './types/post.js';
import { ChangeProfileInputType, CreateProfileInputType, ProfileType } from './types/profile.js';

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
        id: { type: MemberTypeIdEnum}
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberType)
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(PostType),
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      }
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      }
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
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInputType },
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInputType },
      },
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: CreateProfileInputType },
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInputType },
      },
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
  }
})


export const schema = new GraphQLSchema({
  query: Query,
  mutation : Mutation,
  types: [
    UUIDType,
    MemberType,
    MemberTypeIdEnum,
    PostType,
    UserType,
    ProfileType,
    CreateUserInputType,
    ChangeUserInputType,
    CreatePostInputType,
    ChangePostInputType,
    CreateProfileInputType,
    ChangeProfileInputType
  ]
})