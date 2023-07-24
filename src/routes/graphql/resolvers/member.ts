import { Context, Data, ID } from "../types/common.js";

const getMemberType = async ({ id }: ID, { prisma }: Context) => {
    return await prisma.memberType.findUnique({ where: { id } });
};
  
const getMemberTypes = async (_: Data, { prisma }: Context) => {
    return await prisma.memberType.findMany();
};
  
export default {
    memberType: getMemberType,
    memberTypes: getMemberTypes,
};