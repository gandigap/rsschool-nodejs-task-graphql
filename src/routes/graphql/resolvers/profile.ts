import { PrismaClient } from '@prisma/client';
import { Context, ID } from '../types/common.js';
import { ProfileInput } from '../types/profile.js';

const prisma = new PrismaClient();

const getProfile = async (args: ID) => {
    return await prisma.profile.findUnique({ where: { id: args.id }});
};

const getProfiles = async () => {
    return await prisma.profile.findMany();
};

const createProfile = async (
    { dto: data}: { dto: ProfileInput },
    { prisma }: Context
) => {
    try {
        return await prisma.profile.create({ data });
    } catch {
        return null;
    }
};
  
const changeProfile = async (
    { id, dto: data}: ID & { dto: Partial<ProfileInput> },
    { prisma }: Context
) => {
    try {
        return await prisma.profile.update({ where: { id }, data });
    } catch {
        return null;
    }
};
  
const deleteProfile = async ({ id }: ID, { prisma }: Context) => {
    try {
        await prisma.profile.delete({ where: { id } });
        return id;
    } catch {
        return null;
    }
};

export default {
    profile: getProfile,
    profiles: getProfiles,
    createProfile,
    changeProfile,
    deleteProfile
};