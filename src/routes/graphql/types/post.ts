import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { UserType } from "./user.js";
import { Context, Data, ID } from "./common.js";
import { getUser } from "../resolvers/user.js";

export interface PostInput {
    title: string;
    content: string;
    authorId: string;
}

export interface Post extends ID, PostInput {}

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType)},
        title: { type: new GraphQLNonNull(GraphQLString)},
        content: { type: new GraphQLNonNull(GraphQLString)},
        author: {
            type: UserType,
            resolve: async (source: Post, _: Data, context: Context) => {
                return await getUser({ id: source.authorId }, context)
            }                
        }
    })
})

export const CreatePostInputType = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
});

export const ChangePostInputType = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: () => ({
        title: { type: GraphQLString},
        content: { type: GraphQLString}   
    })
})


