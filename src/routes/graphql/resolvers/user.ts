import { ID, Context, Data, SubscriptionMutation } from "../types/common.js";
import { UserInput } from "../types/user.js";

const getUser = async ({ id }: ID, { prisma }: Context) => {   
    return await prisma.user.findUnique({ where: { id } });    
};

const getUsers = async (_: Data, { prisma }: Context) => {
    return await prisma.user.findMany()
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