const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Shitpost = require('./resolvers/Shitpost');
const Channel = require('./resolvers/Channel');
const User = require('./resolvers/User');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const resolvers = {
    Shitpost,
    Channel,
    User,
    Query,
    Mutation
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: function(request) {
        return { ...request, prisma };
    }
});

server.start(function() {
    console.log('Server is running on http://localhost:4000');
});