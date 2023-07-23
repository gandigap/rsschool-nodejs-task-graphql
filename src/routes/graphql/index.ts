import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import userResolvers from './resolvers/user.js';
import memberResolvers from './resolvers/member.js';
import postResolvers from './resolvers/post.js';
import profileResolvers from './resolvers/profile.js';
import depthLimit from 'graphql-depth-limit';

const rootValue = {
  ...userResolvers,
  ...memberResolvers,
  ...postResolvers,
  ...profileResolvers,
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const errors = validate(schema, parse(req.body.query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }
      
      const response = await graphql({
        schema: schema,
        source: req.body.query,
        rootValue,
        variableValues: req.body.variables,
        contextValue: { prisma }
      });
      return response;
    },
  });
};

export default plugin;