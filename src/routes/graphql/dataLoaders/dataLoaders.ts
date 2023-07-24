import DataLoader from "dataloader";
import { MemberType, PrismaClient, Profile} from "@prisma/client";
import { MemberTypeId } from "../../member-types/schemas.js";
import { Post } from "../types/post.js";
import { User } from "../types/user.js";

export interface DataLoaders {
    memberTypeLoader: DataLoader<MemberTypeId, MemberType>,
    postsByAuthorIdLoader: DataLoader<string, Post[]>,
    profilesByMemberTypeIdLoader: DataLoader<string, Profile[]>;
    profileByUserIdLoader: DataLoader<string, Profile>;
    userLoader: DataLoader<string, User>,
};

export const getDataLoaders = (prisma: PrismaClient): DataLoaders => {
    const getMemberTypeBatch = async (ids: readonly MemberTypeId[]) => {
        const memberTypes = await prisma.memberType.findMany({
            where: { id: { in: ids as MemberTypeId[] }}
        });
    
        const memberTypeMap = memberTypes.reduce((acc, memberType) => {
            acc[memberType.id] = memberType;
            return acc;
        }, {} as Record<MemberTypeId, MemberType>);
    
        return ids.map(id => memberTypeMap[id]);
    };
      
    const getPostsByAuthorIdBatch = async (ids: readonly string[]) => {
        const posts = await prisma.post.findMany({
            where: { authorId: { in: ids as string[] } },
        });

        const postMap = posts.reduce((acc, post) => {
            acc[post.authorId] ? acc[post.authorId].push(post) : acc[post.authorId] = [post];
            return acc;
        }, {} as Record<string, Post[]>);
        
        return ids.map(id => postMap[id]);
    };
    
    const getProfilesByMemberTypeIdBatch = async (ids: readonly MemberTypeId[]) => {
        const profiles = await prisma.profile.findMany({
            where: { memberTypeId: { in: ids as MemberTypeId[] } },
        });
    
        const profileMap = profiles.reduce(
            (acc, profile) => {
                acc[profile.memberTypeId]
                ? acc[profile.memberTypeId].push(profile)
                : (acc[profile.memberTypeId] = [profile]);
                return acc;
            }, {} as Record<string, Profile[]>);
    
        return ids.map((id) => profileMap[id]);
    };

    const getUserByIdBatch = async (ids: readonly string[]) => {
        const users = await prisma.user.findMany({
            where: { id: { in: ids as string[] } },
            include: {
                userSubscribedTo: true,
                subscribedToUser: true,
            },
        });
    
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {} as Record<string, User>);
    
        return ids.map(id => userMap[id]);
    };

    const getProfileByUserIdBatch = async (ids: readonly string[]) => {
        const profiles = await prisma.profile.findMany({
            where: { userId: { in: ids as string[] } },
        });
    
        const profileMap = profiles.reduce((acc, profile) => {
            acc[profile.userId] = profile;
            return acc;
        }, {} as Record<string, Profile>);
    
        return ids.map((id) => profileMap[id]);
    };
    
    return {
        memberTypeLoader: new DataLoader(getMemberTypeBatch),
        postsByAuthorIdLoader: new DataLoader(getPostsByAuthorIdBatch),
        profilesByMemberTypeIdLoader: new DataLoader(getProfilesByMemberTypeIdBatch),
        userLoader: new DataLoader(getUserByIdBatch),
        profileByUserIdLoader: new DataLoader(getProfileByUserIdBatch),
    }
};
  