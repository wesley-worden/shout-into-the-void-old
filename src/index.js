const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Content = require('./resolvers/Content');
const UserLocation = require('./resolvers/UserLocation');
const User = require('./resolvers/User');
const ShoutInVoid = require('./resolvers/ShoutInVoid');
const ReplyToShoutInVoid = require('./resolvers/ReplyToShoutInVoid');
const UserActivatedEchoOfShout = require('./resolvers/UserActivatedEchoOfShout');
const EchoOfShoutInVoid = require('./resolvers/EchoOfShoutInVoid');
const ReplyToEchoOfShoutInVoid = require('./resolvers/ReplyToEchoOfShoutInVoid');
const NVoid = require('./resolvers/NVoid');
const UserSavedVoid = require('./resolvers/UserSavedVoid');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const resolvers = {
    Content,
    User,
    UserLocation,
    ShoutInVoid,
    ReplyToShoutInVoid,
    UserActivatedEchoOfShout,
    EchoOfShoutInVoid,
    ReplyToEchoOfShoutInVoid,
    NVoid,
    UserSavedVoid,

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