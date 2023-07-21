import { ID, Context, Data } from "../types/common.js";
import { UserInput } from "../types/user.js";

export const getUser = async ({ id }: ID, { prisma }: Context) => {   
    return await prisma.user.findUnique({ where: { id } });    
};

export  const getUsers = async(_: Data, { prisma }: Context) => {
    return await prisma.user.findMany()
}

export  const createUser = async({ dto: data } : { dto: UserInput }, { prisma }: Context ) => {
    return await prisma.user.create({ data })
}

export const changeUser = async (
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
}

export const deleteUser = async ({ id }: ID, { prisma }: Context) => {
    try {
        await prisma.user.delete({ where: {id}})
        return id
    } catch  {
        return null;
    }
}

export default {
    user: getUser,
    users: getUsers,
    createUser,
    changeUser,
    deleteUser
};