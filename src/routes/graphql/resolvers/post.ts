import { Context, Data, ID } from '../types/common.js';
import { PostInput } from '../types/post.js';

const getPost = async ({ id}: ID, { prisma }: Context) => {
    return await prisma.post.findUnique({
        where: { id }
    });
};

const getPosts = async (_: Data, { prisma }: Context) => {
    return await prisma.post.findMany();
};

const createPost = async ({ dto: data }: { dto: PostInput }, { prisma }: Context) => {
    return await prisma.post.create({ data });
};
  
const changePost = async (
    { id, dto: data }: ID & { dto: Partial<PostInput> },
    { prisma }: Context,
) => {
    try {
        return await prisma.post.update({ where: { id }, data });      
    } catch {
        return null;
    }
  };
  
const deletePost = async ({ id }: ID, { prisma }: Context) => {
    try {
        await prisma.post.delete({ where: { id } });
        return id;
    } catch {
        return null;
    }
};

export default {
  post: getPost,
  posts: getPosts,
  createPost,
  changePost,
  deletePost,
};