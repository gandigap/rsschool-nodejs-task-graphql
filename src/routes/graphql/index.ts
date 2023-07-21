import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql } from 'graphql';
import userResolvers from './resolvers/user.js';
import memberResolvers from './resolvers/member.js';

const rootValue = {
  ...userResolvers,
  ...memberResolvers,
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma }  = fastify;

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