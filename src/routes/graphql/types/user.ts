import { GraphQLFloat, GraphQLInputObjectType, 
  GraphQLList, 
  GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileType } from "./profile.js";
import { getPostsByUserId } from "../resolvers/post.js";
import { getProfileByUserId } from "../resolvers/profile.js";
import { PostType } from "./post.js";
import { Context, Data, ID } from "./common.js";
import { getUserFollowers, getUserSubscriptions } from "../resolvers/user.js";

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: async (source: User, _: Data, context: Context) =>
        await getProfileByUserId(source.id, context),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (source: User, _: Data, context: Context) =>
        await getPostsByUserId(source.id, context),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (source: User, _: Data, context: Context) =>
        await getUserSubscriptions(source.id, context),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (source: User, _: Data, context: Context) =>
        await getUserFollowers(source.id, context),
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

export interface User extends ID, UserInput {}

export interface UserInput {
  name: string;
  balance: number;
};