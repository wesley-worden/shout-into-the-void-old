const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Content = require('./resolvers/Content');
const User = require('./resolvers/User');
const ShoutInVoid = require('./resolvers/ShoutInVoid');
const ReplyToShoutInVoid = require('./resolvers/ReplyToShoutInVoid');
const SavedReplyToShoutInVoid = require('./resolvers/SavedReplyToShoutInVoid');
const EchoEdge = require('./resolvers/EchoEdge');
const EchoInVoid = require('./resolvers/EchoInVoid');
const ReplyToEchoInVoid = require('./resolvers/ReplyToEchoInVoid');
const SavedReplyToEchoInVoid = require('./resolvers/SavedReplyToEchoInVoid');
const SavedEcho = require('./resolvers/SavedEcho');
const NVoid = require('./resolvers/NVoid');
const SavedVoid = require('./resolvers/SavedVoid');

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