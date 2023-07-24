import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";
import { ID, Context, Data, SubscriptionMutation } from "../types/common.js";
import { UserInput, UserType } from "../types/user.js";
import { GraphQLList, GraphQLResolveInfo } from "graphql";

const getUser = async ({ id }: ID, { userLoader }: Context) => {
  const user = await userLoader.load(id);
  return user;
};

const getUsers = async (_: Data, { prisma, userLoader }: Context, graphQLResolveInfo: GraphQLResolveInfo) => {
  const parsedResolveInfoFragment = parseResolveInfo(graphQLResolveInfo);
  const { fields }: { fields: { [key in string]: ResolveTree} } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment as ResolveTree,
    new GraphQLList(UserType)
  );

  const users = await prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser,
    },
  });

  users.forEach(user => {
    userLoader.prime(user.id, user);
  });

  return users;
};

const createUser = async (
  { dto: data } : { dto: UserInput },
  { prisma }: Context 
) => {
  return await prisma.user.create({ data })
};

const changeUser = async (
  { id, dto: data }: ID & { dto: Partial<UserInput> },
  { prisma}: Context
) => {
  try {
     return await prisma.user.update({
          where: {id}, data
      })
  } catch  {
      return null
  }
};

const deleteUser = async ({ id }: ID, { prisma }: Context) => {
  try {
      await prisma.user.delete({ where: {id}})
      return id
  } catch  {
      return null;
  }
};

const subscribeTo = async (
  { userId: id, authorId }: SubscriptionMutation,
  { prisma }: Context,
) => {
  try {
      const user = prisma.user.update({
          where: { id },
          data: { userSubscribedTo: { create: { authorId } } }
      });
      return user;
  } catch {
      return null;
  }
};

const unsubscribeFrom = async (
  { userId: subscriberId, authorId }: SubscriptionMutation,
  { prisma }: Context,
) => {
  try {
      await prisma.subscribersOnAuthors.delete({
          where: { subscriberId_authorId: { subscriberId, authorId } }
      });
  } catch {
      return null;
  }
};

export default {
  user: getUser,
  users: getUsers,
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
};