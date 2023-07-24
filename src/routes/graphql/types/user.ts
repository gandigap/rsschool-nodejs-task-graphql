import { GraphQLFloat, GraphQLInputObjectType, 
  GraphQLList, 
  GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { PostType } from "./post.js";
import { Context, Data, ID, Subscription } from "./common.js";

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: async(
        source: User, _: Data, { profileByUserIdLoader }: Context
        ) => profileByUserIdLoader.load(source.id)
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async(
        source: User, _: Data, { postsByAuthorIdLoader }: Context
        ) => postsByAuthorIdLoader.load(source.id)
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source: User, _: Data, { userLoader }: Context) =>
        source.userSubscribedTo
          ? userLoader.loadMany(source.userSubscribedTo.map(({ authorId }) => authorId))
          : null
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source: User, _: Data, { userLoader }: Context) =>
        source.subscribedToUser
          ? userLoader.loadMany(source.subscribedToUser.map(({ subscriberId }) => subscriberId))
          : null
    }   
  })
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) }
  }
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  }
});

export interface User extends ID, UserInput {
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}

export interface UserInput {
  name: string;
  balance: number;
};