const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Content = require('./resolvers/Content');
const User = require('./resolvers/User');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const resolvers = {
    Content,
    User,
    ShoutInVoid,
    ReplyToShoutInVoid,
    SavedReplyToShoutInVoid,
    SavedShout,
    EchoEdge,
    EchoInVoid,
    ReplyToEchoInVoid,
    SavedReplyToEchoInVoid,
    SavedEcho,
    NVoid,
    SavedVoid,
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